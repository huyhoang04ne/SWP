using GHMS.DAL.Data;
using GHMS.DAL.Models;
using Microsoft.EntityFrameworkCore;
using GHMS.Common.Interfaces;
using GHMS.Common.Config;
using GHMS.Common.Helpers;

namespace GHMS.BLL.Jobs
{
    public class NoShowDetectionJob
    {
        private readonly GHMSContext _context;
        private readonly IEmailService _emailService;
        private readonly NotificationTemplateSettings _notificationTemplates;

        public NoShowDetectionJob(
            GHMSContext context, 
            IEmailService emailService,
            NotificationTemplateSettings notificationTemplates)
        {
            _context = context;
            _emailService = emailService;
            _notificationTemplates = notificationTemplates;
        }

        public async Task RunAsync()
        {
            // Chỉ chạy vào 21:00 mỗi ngày
            if (!TimeSlotHelper.IsNoShowNotificationTime())
            {
                return;
            }

            var today = DateTime.UtcNow.AddHours(7).Date; // Chuyển về múi giờ Việt Nam và lấy ngày hôm nay

            // Tìm tất cả các buổi tư vấn đã được xác nhận trong ngày hôm nay
            var todaysConsultations = await _context.ConsultationSchedules
                .Include(c => c.Patient)
                .Include(c => c.Counselor)
                .Where(c => !c.IsCanceled
                    && c.Status == ConsultationStatus.Confirmed
                    && c.ScheduledDate.Date == today)
                .ToListAsync();

            foreach (var consultation in todaysConsultations)
            {
                // Kiểm tra xem buổi tư vấn đã kết thúc chưa (dựa trên ca làm việc)
                var consultationEndTime = consultation.ScheduledDate.Date.Add(TimeSlotHelper.GetDefaultEndTime(consultation.TimeSlot));
                var now = DateTime.UtcNow.AddHours(7); // Múi giờ Việt Nam

                // Nếu buổi tư vấn đã kết thúc và bệnh nhân chưa tham gia
                if (now >= consultationEndTime)
                {
                    // Đánh dấu NoShow
                    consultation.Status = ConsultationStatus.NoShow;
                    consultation.Notes += $"\n[Auto NoShow]: Tự động đánh dấu vắng mặt vào {now:dd/MM/yyyy HH:mm}";

                    // Gửi email thông báo cho bệnh nhân
                    if (consultation.Patient != null && consultation.Counselor != null)
                    {
                        var subject = _notificationTemplates.NoShowSubject;
                        var body = string.Format(_notificationTemplates.NoShowBody,
                            consultation.Patient.FullName,
                            consultation.Counselor.FullName,
                            consultation.ScheduledDate);

                        await _emailService.SendEmailAsync(consultation.Patient.Email, subject, body);
                    }
                }
            }

            await _context.SaveChangesAsync();
        }
    }
} 