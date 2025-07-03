using GHMS.Common.Req;
using GHMS.Common.Rsp;
using GHMS.DAL.Data;
using GHMS.DAL.Models;
using Microsoft.EntityFrameworkCore;
using GHMS.Common.Config;

namespace GHMS.BLL.Services
{
    public class ConsultationService
    {
        private readonly GHMSContext _context;
        private readonly ScheduleService _scheduleService;
        private readonly NotificationTemplateSettings _notificationTemplates;
        private readonly EmailService _emailService;
        private readonly NotificationService _notificationService;

        public ConsultationService(
            GHMSContext context,
            ScheduleService scheduleService,
            NotificationTemplateSettings notificationTemplates,
            EmailService emailService,
            NotificationService notificationService)
        {
            _context = context;
            _scheduleService = scheduleService;
            _notificationTemplates = notificationTemplates;
            _emailService = emailService;
            _notificationService = notificationService;
        }

        public async Task<BaseResponse> BookConsultationAsync(string patientId, ConsultationBookingReq req)
        {
            // Không cho phép đặt lịch trong quá khứ
            if (req.ScheduledDate.Date < DateTime.Today)
                return BaseResponse.Fail("Không thể đặt lịch trong quá khứ.");

            string counselorId = req.CounselorId;

            // Nếu không chỉ định tư vấn viên, tự động gán
            if (string.IsNullOrEmpty(counselorId))
            {
                var availableCounselors = await _scheduleService.GetAvailableCounselors(req.ScheduledDate, req.TimeSlot);
                if (!availableCounselors.Any())
                    return BaseResponse.Fail("Không có tư vấn viên rảnh vào thời gian này.");
                // Chọn random hoặc theo tiêu chí khác
                counselorId = availableCounselors.First().Id;
            }

            // Kiểm tra counselor có ca làm việc không
            var isWorking = await _context.WorkingSchedules.AnyAsync(w =>
                w.CounselorId == counselorId &&
                w.WorkDate.Date == req.ScheduledDate.Date &&
                w.TimeSlot == req.TimeSlot &&
                w.IsAvailable);

            if (!isWorking)
                return BaseResponse.Fail("Counselor không làm việc vào thời gian này.");

            // Kiểm tra counselor có đang bận không
            var isCounselorBusy = await _context.ConsultationSchedules.AnyAsync(c =>
                c.CounselorId == counselorId &&
                c.ScheduledDate.Date == req.ScheduledDate.Date &&
                c.TimeSlot == req.TimeSlot &&
                !c.IsCanceled);

            if (isCounselorBusy)
                return BaseResponse.Fail("Counselor đã có lịch tư vấn vào thời gian này.");

            // Kiểm tra bệnh nhân có trùng lịch không
            var isPatientBusy = await _context.ConsultationSchedules.AnyAsync(c =>
                c.PatientId == patientId &&
                c.ScheduledDate.Date == req.ScheduledDate.Date &&
                c.TimeSlot == req.TimeSlot &&
                !c.IsCanceled);

            if (isPatientBusy)
                return BaseResponse.Fail("Bạn đã có cuộc hẹn tư vấn vào thời gian này.");

            // Tạo cuộc hẹn
            var booking = new ConsultationSchedule
            {
                PatientId = patientId,
                CounselorId = counselorId,
                ScheduledDate = req.ScheduledDate,
                TimeSlot = req.TimeSlot,
                Status = ConsultationStatus.Pending,
                Notes = req.Notes,
                IsCanceled = false
            };

            _context.ConsultationSchedules.Add(booking);
            await _context.SaveChangesAsync();

            // Gửi thông báo email cho bệnh nhân và tư vấn viên
            var patient = await _context.Users.FindAsync(patientId);
            var counselor = await _context.Users.FindAsync(counselorId);
            if (patient != null && counselor != null)
            {
                var subject = _notificationTemplates.BookingSuccessSubject;
                var body = string.Format(_notificationTemplates.BookingSuccessBody, patient.FullName, counselor.FullName, booking.ScheduledDate);
                await _emailService.SendEmailAsync(patient.Email, subject, body);
            }

            return BaseResponse.Ok(booking, "Đặt lịch thành công.");
        }

        public async Task<List<ConsultationSchedule>> GetBookingsByPatientAsync(string patientId)
        {
            return await _context.ConsultationSchedules
                .Where(c => c.PatientId == patientId)
                .OrderByDescending(c => c.ScheduledDate)
                .ToListAsync();
        }

        public async Task<List<ConsultationSchedule>> GetAppointmentsByCounselorAsync(string counselorId)
        {
            return await _context.ConsultationSchedules
                .Where(c => c.CounselorId == counselorId)
                .OrderByDescending(c => c.ScheduledDate)
                .ToListAsync();
        }

        public async Task<BaseResponse> UpdateConsultationStatusAsync(int id, string counselorId, ConsultationStatusUpdateReq req)
        {
            var booking = await _context.ConsultationSchedules.FindAsync(id);
            if (booking == null)
                return BaseResponse.Fail("Không tìm thấy lịch tư vấn.");

            if (booking.CounselorId != counselorId)
                return BaseResponse.Fail("Bạn không có quyền cập nhật lịch tư vấn này.");

            if (booking.IsCanceled)
                return BaseResponse.Fail("Lịch tư vấn này đã bị huỷ.");

            booking.Status = req.Status;
            if (!string.IsNullOrEmpty(req.Reason))
                booking.Notes += $"\n[Counselor Note]: {req.Reason}";

            await _context.SaveChangesAsync();

            // Gửi email xác nhận lịch nếu status là Confirmed
            if (req.Status == ConsultationStatus.Confirmed)
            {
                var patient = await _context.Users.FindAsync(booking.PatientId);
                var counselor = await _context.Users.FindAsync(booking.CounselorId);
                if (patient != null && counselor != null)
                {
                    var subject = _notificationTemplates.ConfirmBookingSubject;
                    var body = string.Format(_notificationTemplates.ConfirmBookingBody, patient.FullName, counselor.FullName, booking.ScheduledDate);
                    await _emailService.SendEmailAsync(patient.Email, subject, body);
                }
            }

            return BaseResponse.Ok(null, "Cập nhật trạng thái thành công.");
        }

        public async Task<BaseResponse> CancelConsultationAsync(int id, string userId, string role, string? reason = null)
        {
            var booking = await _context.ConsultationSchedules.FindAsync(id);
            if (booking == null)
                return BaseResponse.Fail("Không tìm thấy lịch tư vấn.");

            // Chỉ cho phép huỷ nếu là bệnh nhân hoặc tư vấn viên liên quan
            if (role == "Patient" && booking.PatientId != userId)
                return BaseResponse.Fail("Bạn không có quyền huỷ lịch tư vấn này.");
            if (role == "Counselor" && booking.CounselorId != userId)
                return BaseResponse.Fail("Bạn không có quyền huỷ lịch tư vấn này.");

            if (booking.IsCanceled)
                return BaseResponse.Fail("Lịch tư vấn này đã bị huỷ trước đó.");

            booking.IsCanceled = true;
            booking.Status = ConsultationStatus.Cancelled;
            if (!string.IsNullOrEmpty(reason))
                booking.Notes += $"\n[Huỷ lịch]: {reason}";

            await _context.SaveChangesAsync();

            // Gửi thông báo email cho bệnh nhân và tư vấn viên
            var patient = await _context.Users.FindAsync(booking.PatientId);
            var counselor = await _context.Users.FindAsync(booking.CounselorId);
            if (patient != null && counselor != null)
            {
                var subject = _notificationTemplates.CancelBookingPatientSubject;
                var body = string.Format(_notificationTemplates.CancelBookingPatientBody, patient.FullName, counselor.FullName, booking.ScheduledDate, reason);
                await _emailService.SendEmailAsync(patient.Email, subject, body);
            }

            return BaseResponse.Ok(null, "Huỷ lịch thành công.");
        }
    }
}
