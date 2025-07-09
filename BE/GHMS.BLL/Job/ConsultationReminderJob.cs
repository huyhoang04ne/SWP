using GHMS.DAL.Data;
using GHMS.DAL.Models;
using Microsoft.EntityFrameworkCore;
using GHMS.Common.Interfaces;
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

public class ConsultationReminderJob
{
    private readonly GHMSContext _context;
    private readonly IEmailService _emailService;

    public ConsultationReminderJob(GHMSContext context, IEmailService emailService)
    {
        _context = context;
        _emailService = emailService;
    }

    public async Task RunAsync()
    {
        var now = DateTime.UtcNow;
        var reminders = new[] { 24, 1 }; // số giờ trước lịch hẹn

        foreach (var hoursBefore in reminders)
        {
            var from = now.AddMinutes(0);
            var to = now.AddHours(hoursBefore).AddMinutes(10); // window 10 phút để tránh miss

            // Lấy các lịch tư vấn đã xác nhận, chưa bị hủy, sắp diễn ra
            var bookings = await _context.ConsultationSchedules
                .Where(c => !c.IsCanceled
                    && c.Status == ConsultationStatus.Confirmed
                    && c.ScheduledDate > from
                    && c.ScheduledDate <= to
                )
                .Include(c => c.Patient)
                .Include(c => c.Counselor)
                .ToListAsync();

            foreach (var booking in bookings)
            {
                // Kiểm tra đã gửi nhắc nhở chưa (bước 4)
                bool alreadyReminded = await _context.ConsultationReminders
                    .AnyAsync(r => r.ConsultationId == booking.Id && r.HoursBefore == hoursBefore);
                if (alreadyReminded) continue;

                // Gửi email cho bệnh nhân
                string counselorName = booking.Counselor?.FullName ?? "Tư vấn viên";
                string patientName = booking.Patient?.FullName ?? "Bệnh nhân";

                string subject = $"[Nhắc nhở] Lịch tư vấn online sau {hoursBefore} giờ";
                string body = $"Bạn có lịch tư vấn với {counselorName} vào lúc {booking.ScheduledDate:dd/MM/yyyy HH:mm}.";
                if (!string.IsNullOrEmpty(booking.Patient?.Email))
                    await _emailService.SendEmailAsync(booking.Patient.Email, subject, body);

                // Gửi email cho tư vấn viên
                string counselorBody = $"Bạn có lịch tư vấn với {patientName} vào lúc {booking.ScheduledDate:dd/MM/yyyy HH:mm}.";
                if (!string.IsNullOrEmpty(booking.Counselor?.Email))
                    await _emailService.SendEmailAsync(booking.Counselor.Email, subject, counselorBody);

                // Lưu log đã gửi nhắc nhở
                _context.ConsultationReminders.Add(new ConsultationReminder
                {
                    ConsultationId = booking.Id,
                    HoursBefore = hoursBefore,
                    SentAt = now
                });
            }
            await _context.SaveChangesAsync();
        }
    }
}
