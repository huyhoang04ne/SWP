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
        private readonly EmailService _emailService;
        private readonly UserManager<AppUser> _userManager;

        public MedicationReminderService(GHMSContext context, EmailService emailService, UserManager<AppUser> userManager)
        {
            _context = context;
            _emailService = emailService;
            _userManager = userManager;
        }

        public async Task SetOrUpdateScheduleAsync(SetScheduleReq req, string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                throw new ArgumentException("Người dùng không tồn tại.");

            var existing = await _context.MedicationSchedules
                .Include(s => s.Reminders)
                .FirstOrDefaultAsync(s => s.UserId == userId);

            if (existing != null)
            {
                _context.MedicationReminders.RemoveRange(existing.Reminders);
                _context.MedicationSchedules.Remove(existing);
                await _context.SaveChangesAsync();
            }

            var schedule = new MedicationSchedule
            {
                Id = Guid.NewGuid().ToString(),
                UserId = userId,
                PillType = req.PillType,
                ReminderHour = req.ReminderHour,
                ReminderMinute = req.ReminderMinute,
                StartDate = DateTime.UtcNow.Date
            };

            var reminders = GenerateReminders(schedule);
            schedule.Reminders = reminders;

            _context.MedicationSchedules.Add(schedule);
            await _context.SaveChangesAsync();
        }

        private List<MedicationReminder> GenerateReminders(MedicationSchedule schedule)
        {
            var list = new List<MedicationReminder>();
            int totalDays = 28; // vỉ 21 vẫn tạo đủ 28 ngày

            for (int i = 0; i < totalDays; i++)
            {
                var day = schedule.StartDate.AddDays(i);
                bool isRealPill = schedule.PillType == 28 || i < 21;

                if (isRealPill)
                {
                    var dateTime = new DateTime(
                        day.Year, day.Month, day.Day,
                        schedule.ReminderHour, schedule.ReminderMinute, 0);

                    list.Add(new MedicationReminder
                    {
                        Id = Guid.NewGuid().ToString(),
                        ScheduleId = schedule.Id,
                        ReminderTime = dateTime,
                        IsTaken = false,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    });
                }
            }

            return list;
        }

        public async Task<List<MedicationReminder>> GetUpcomingRemindersAsync(string userId)
        {
            return await _context.MedicationReminders
                .Where(r => r.Schedule.UserId == userId && r.ReminderTime >= DateTime.UtcNow)
                .OrderBy(r => r.ReminderTime)
                .Take(10)
                .ToListAsync();
        }

        public async Task SendDailyReminders()
        {
            var now = DateTime.UtcNow;
            var today = now.Date;

            var reminders = await _context.MedicationReminders
                .Include(r => r.Schedule)
                .ThenInclude(s => s.User)
                .Where(r =>
                    r.ReminderTime.Date == today &&
                    r.ReminderTime.Hour == now.Hour &&
                    !r.IsTaken)
                .ToListAsync();

            foreach (var reminder in reminders)
            {
                if (reminder.Schedule?.User?.Email != null)
                {
                    var email = reminder.Schedule.User.Email;
                    var subject = "Nhắc nhở uống thuốc";
                    var body = $"Bạn cần uống thuốc vào lúc {reminder.ReminderTime:HH:mm} hôm nay.";

                    await _emailService.SendEmailAsync(email, subject, body);

                    reminder.IsTaken = true;
                    reminder.UpdatedAt = DateTime.UtcNow;
                }
            }

            await _context.SaveChangesAsync();
        }
    }
}
