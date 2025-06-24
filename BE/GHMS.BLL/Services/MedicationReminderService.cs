using GHMS.Common.Req;
using GHMS.DAL.Data;
using GHMS.DAL.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace GHMS.BLL.Services
{
    public class MedicationReminderService
    {
        private readonly EmailService _emailService;
        private readonly GHMSContext _context;

        public MedicationReminderService(EmailService emailService, GHMSContext context)
        {
            _emailService = emailService;
            _context = context;
        }

        public async Task SendReminderEmail(MedicationReminder reminder)
        {
            var subject = "Nhắc nhở uống thuốc";
            var body = $"Đây là thông báo nhắc nhở bạn uống thuốc {reminder.MedicationName} vào lúc {reminder.ReminderTime:HH:mm}. Hãy nhớ uống đúng giờ!";
            await _emailService.SendEmailAsync(reminder.UserId, subject, body);
        }

        public async Task CreateMedicationRemindersAsync(MedicationReminderCreateReq request, string userId)
        {
            if (request.PillType != 21 && request.PillType != 28)
                throw new ArgumentException("PillType must be 21 or 28.");
            if (string.IsNullOrEmpty(userId))
                throw new ArgumentException("UserId is required.");

            var numberOfDays = request.PillType;
            var reminders = new List<MedicationReminder>();
            var startDate = DateTime.UtcNow.Date;

            for (int day = 0; day < numberOfDays; day++)
            {
                var reminderDate = startDate.AddDays(day);
                // Sửa lỗi: Sử dụng toán tử + để kết hợp DateTime với TimeSpan thay vì Add
                var reminderTime = reminderDate + request.ReminderTime; // Tạo DateTime từ ngày + giờ
                reminders.Add(new MedicationReminder
                {
                    UserId = userId,
                    MedicationName = request.MedicationName,
                    ReminderTime = reminderTime, // Đảm bảo gán DateTime vào DateTime
                    PillCount = request.PillType,
                    IsTaken = false,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                });
            }

            _context.MedicationReminders.AddRange(reminders);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> MarkReminderAsTakenAsync(string reminderId)
        {
            var reminder = await _context.MedicationReminders.FindAsync(reminderId);
            if (reminder == null) return false;

            reminder.IsTaken = true;
            reminder.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return true;
        }
    }
}