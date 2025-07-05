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
                var subject = _notificationTemplates.BookingPendingSubject;
                var body = string.Format(_notificationTemplates.BookingPendingBody, patient.FullName, counselor.FullName, booking.ScheduledDate);
                await _emailService.SendEmailAsync(patient.Email, subject, body);
            }

            return BaseResponse.Ok(booking, "Đã đặt lịch thành công, vui lòng chờ tư vấn viên xác nhận.");
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
                var subject = _notificationTemplates.CancelBookingSubject;
                var body = string.Format(_notificationTemplates.CancelBookingBody, patient.FullName, counselor.FullName, booking.ScheduledDate, reason);
                await _emailService.SendEmailAsync(patient.Email, subject, body);
            }

            return BaseResponse.Ok(null, "Huỷ lịch thành công.");
        }

        public async Task<BaseResponse> ProposeRescheduleAsync(string counselorId, RescheduleProposalReq req)
        {
            // 1. Hủy lịch cũ
            var oldBooking = await _context.ConsultationSchedules.FindAsync(req.OldBookingId);
            if (oldBooking == null) return BaseResponse.Fail("Không tìm thấy lịch cũ.");
            if (oldBooking.CounselorId != counselorId) return BaseResponse.Fail("Không có quyền.");

            oldBooking.IsCanceled = true;
            oldBooking.Status = ConsultationStatus.Cancelled;
            oldBooking.Notes += $"\n[Huỷ lịch]: {req.Reason}";
            await _context.SaveChangesAsync();

            // 2. Tạo proposal
            var proposal = new RescheduleProposal
            {
                OldBookingId = req.OldBookingId,
                CounselorId = counselorId,
                PatientId = oldBooking.PatientId,
                Reason = req.Reason,
                CreatedAt = DateTime.UtcNow,
                ProposedSlots = req.ProposedSlots.Select(s => new ProposedSlot
                {
                    Date = s.Date,
                    TimeSlot = s.TimeSlot
                }).ToList()
            };
            _context.RescheduleProposals.Add(proposal);
            await _context.SaveChangesAsync();

            // 3. Gửi email cho Patient
            var patient = await _context.Users.FindAsync(oldBooking.PatientId);
            var counselor = await _context.Users.FindAsync(counselorId);
            if (patient != null && counselor != null)
            {
                var slotHtml = string.Join("<br>", proposal.ProposedSlots.Select(s => $"{s.Date:dd/MM/yyyy} - Ca {s.TimeSlot}"));
                var subject = _notificationTemplates.RescheduleProposalSubject;
                var body = string.Format(_notificationTemplates.RescheduleProposalBody,
                    patient.FullName, counselor.FullName, req.Reason, slotHtml);
                await _emailService.SendEmailAsync(patient.Email, subject, body);
            }

            return BaseResponse.Ok(proposal, "Đã gửi đề xuất đổi lịch cho bệnh nhân.");
        }

        public async Task<BaseResponse> RespondRescheduleAsync(string patientId, RespondRescheduleReq req)
        {
            var proposal = await _context.RescheduleProposals
                .Include(p => p.ProposedSlots)
                .FirstOrDefaultAsync(p => p.Id == req.ProposalId && p.PatientId == patientId);

            if (proposal == null) return BaseResponse.Fail("Không tìm thấy đề xuất.");

            proposal.PatientAccepted = req.Accept;
            if (req.Accept && req.SelectedSlot != null)
            {
                // Tạo lịch mới
                var slot = proposal.ProposedSlots.FirstOrDefault(s =>
                    s.Date == req.SelectedSlot.Date && s.TimeSlot == req.SelectedSlot.TimeSlot);
                if (slot == null) return BaseResponse.Fail("Slot không hợp lệ.");

                proposal.SelectedSlot = slot;

                var newBooking = new ConsultationSchedule
                {
                    PatientId = proposal.PatientId,
                    CounselorId = proposal.CounselorId,
                    ScheduledDate = slot.Date,
                    TimeSlot = (TimeSlot)slot.TimeSlot,
                    Status = ConsultationStatus.Pending,
                    Notes = "[Đặt lại lịch từ đề xuất]",
                    IsCanceled = false
                };
                _context.ConsultationSchedules.Add(newBooking);
                await _context.SaveChangesAsync();

                // Gửi email xác nhận cho cả hai
                // ... (tùy ý)
            }
            else
            {
                // Ghi nhận từ chối, có thể gửi email thông báo
            }

            await _context.SaveChangesAsync();
            return BaseResponse.Ok(null, req.Accept ? "Đã xác nhận lịch mới." : "Đã từ chối đề xuất.");
        }
    }
}
