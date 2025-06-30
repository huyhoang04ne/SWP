using GHMS.Common.Interfaces;
using GHMS.Common.Req;
using GHMS.DAL.Data;
using GHMS.DAL.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace GHMS.BLL.Services
{
    public class MedicationReminderService
    {
        private readonly GHMSContext _context;
        private readonly UserManager<AppUser> _userManager;
        private readonly IEmailService _emailService;

        public MedicationReminderService(GHMSContext context, UserManager<AppUser> userManager, IEmailService emailService)
        {
            _context = context;
            _userManager = userManager;
            _emailService = emailService;
        }

        /// <summary>
        /// Ghi nhận hoặc cập nhật lịch nhắc thuốc tránh thai (giống logic Menstrual)
        /// </summary>
        public async Task SetOrUpdateScheduleSmartAsync(string userId, SetScheduleReq req)
        {
            var now = DateTime.UtcNow.AddHours(7);
            var today = now.Date;

            // 1. Kiểm tra user có tồn tại

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                throw new InvalidOperationException("User ID không tồn tại trong DbContext.");

            // 2. Validate
            if (!Enum.IsDefined(typeof(PillType), req.PillType))
                throw new ArgumentException("Loại thuốc không hợp lệ.");

            if (req.ReminderHour < 0 || req.ReminderHour > 23 || req.ReminderMinute < 0 || req.ReminderMinute > 59)
                throw new ArgumentException("Giờ hoặc phút nhắc không hợp lệ.");

            // 3. Tìm lịch cũ
            var existing = await _context.MedicationSchedules
                .Include(s => s.Reminders)
                .FirstOrDefaultAsync(s => s.UserId == userId);

            // 4. Nếu có khác thì xoá
            if (existing != null &&
                (existing.PillType != req.PillType ||
                 existing.ReminderHour != req.ReminderHour ||
                 existing.ReminderMinute != req.ReminderMinute))
            {
                _context.MedicationReminders.RemoveRange(existing.Reminders);
                _context.MedicationSchedules.Remove(existing);
                await _context.SaveChangesAsync();
                existing = null;
            }

            // 5. Tạo mới nếu cần
            if (existing == null)
            {
                var schedule = new MedicationSchedule
                {
                    UserId = userId,
                    PillType = req.PillType,
                    ReminderHour = req.ReminderHour,
                    ReminderMinute = req.ReminderMinute,
                    CreatedAt = now,
                    StartDate = today
                };

                _context.MedicationSchedules.Add(schedule);
                await _context.SaveChangesAsync();
            }
        }

        /// <summary>
        /// Gửi email nhắc uống thuốc đúng giờ
        /// </summary>
        public async Task SendDailyReminders()
        {
            var now = DateTime.UtcNow.AddHours(7);
            var hour = now.Hour;
            var minute = now.Minute;

            var schedules = await _context.MedicationSchedules
                .Where(s => s.ReminderHour == hour && s.ReminderMinute == minute)
                .ToListAsync();

            if (!schedules.Any()) return;

            // 🧾 Load template 1 lần duy nhất
            var templatePath = Path.Combine(AppContext.BaseDirectory, "Templates", "MedicationReminderTemplate.html");

            if (!File.Exists(templatePath))
                throw new FileNotFoundException("Không tìm thấy template email.", templatePath);

            var templateContent = await File.ReadAllTextAsync(templatePath);

            foreach (var schedule in schedules)
            {
                var user = await _userManager.FindByIdAsync(schedule.UserId);
                if (user == null || string.IsNullOrEmpty(user.Email)) continue;

                var start = schedule.CreatedAt.Date;
                var currentDay = (now.Date - start).Days % (int)schedule.PillType + 1;

                var isPlacebo = schedule.PillType == PillType.TwentyEight && currentDay > 21;
                var isRest = schedule.PillType == PillType.TwentyOne && currentDay > 21;
                var isLastDay = currentDay == (int)schedule.PillType;

                var note = isPlacebo ? " (giả dược)" : isRest ? " (ngày nghỉ)" : "";
                var lastDayNote = isLastDay
                    ? "<p><strong>💡 Đây là ngày cuối cùng của vỉ thuốc. Đừng quên mua vỉ tiếp theo.</strong></p>"
                    : "";

                var personalizedHtml = templateContent
                    .Replace("{{fullName}}", string.IsNullOrWhiteSpace(user.FullName) ? user.Email : user.FullName)
                    .Replace("{{currentDay}}", currentDay.ToString())
                    .Replace("{{pillTotal}}", ((int)schedule.PillType).ToString())
                    .Replace("{{note}}", note)
                    .Replace("{{reminderTime}}", $"{schedule.ReminderHour:00}:{schedule.ReminderMinute:00}")
                    .Replace("{{lastDayNote}}", lastDayNote);

                await _emailService.SendEmailAsync(user.Email, "Nhắc nhở uống thuốc", personalizedHtml);
            }
        }


        /// <summary>
        /// Trả về trạng thái uống thuốc hôm nay (hiện tại đang là ngày bao nhiêu trong vỉ)
        /// </summary>
        public async Task<object?> GetUserStatusAsync(string userId)
        {
            var schedule = await _context.MedicationSchedules.FirstOrDefaultAsync(s => s.UserId == userId);
            if (schedule == null) return null;

            var today = DateTime.UtcNow.AddHours(7).Date;
            var day = (today - schedule.CreatedAt.Date).Days % (int)schedule.PillType + 1;

            var status = schedule.PillType == PillType.TwentyOne && day > 21 ? "Nghỉ"
                        : schedule.PillType == PillType.TwentyEight && day > 21 ? "Giả dược"
                        : "Hoạt chất";

            return new
            {
                Day = day,
                Total = (int)schedule.PillType,
                Status = status,
                IsLastDay = day == (int)schedule.PillType
            };
        }

        /// <summary>
        /// Trả về lịch nhắc thuốc hiện tại (GET)
        /// </summary>
        public async Task<object?> GetCurrentScheduleAsync(string userId)
        {
            var schedule = await _context.MedicationSchedules
                .Where(s => s.UserId == userId)
                .OrderByDescending(s => s.CreatedAt)
                .FirstOrDefaultAsync();

            if (schedule == null) return null;

            return new
            {
                schedule.PillType,
                schedule.ReminderHour,
                schedule.ReminderMinute,
                schedule.StartDate,
                schedule.CreatedAt
            };
        }
    }
}
