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

            var numberOfDays = request.PillType; // Số ngày bằng số viên (21 hoặc 28)
            var reminders = new List<MedicationReminder>();
            var startDate = DateTime.UtcNow.Date; // Bắt đầu từ hôm nay

            for (int day = 0; day < numberOfDays; day++)
            {
                var reminderDateTime = startDate.AddDays(day).Add(request.ReminderTime);
                reminders.Add(new MedicationReminder
                {
                    UserId = userId,
                    MedicationName = request.MedicationName,
                    ReminderTime = reminderDateTime,
                    PillCount = request.PillType,
                    IsTaken = false,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                });
            }

            _context.MedicationReminders.AddRange(reminders);
            await _context.SaveChangesAsync();
        }
    }
}