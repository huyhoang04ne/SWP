﻿using GHMS.Common.Req;
using GHMS.Common.Rsp;
using GHMS.DAL.Data;
using GHMS.DAL.Models;
using Microsoft.EntityFrameworkCore;
using GHMS.Common.Config;
using GHMS.Common.Helpers;
using Microsoft.AspNetCore.Identity;

namespace GHMS.BLL.Services
{
    public class ConsultationService
    {
        private readonly GHMSContext _context;
        private readonly ScheduleService _scheduleService;
        private readonly NotificationTemplateSettings _notificationTemplates;
        private readonly EmailService _emailService;
        private readonly NotificationService _notificationService;
        private readonly UserManager<AppUser> _userManager;

        public ConsultationService(
            GHMSContext context,
            ScheduleService scheduleService,
            NotificationTemplateSettings notificationTemplates,
            EmailService emailService,
            NotificationService notificationService,
            UserManager<AppUser> userManager)
        {
            _context = context;
            _scheduleService = scheduleService;
            _notificationTemplates = notificationTemplates;
            _emailService = emailService;
            _notificationService = notificationService;
            _userManager = userManager;
        }

        public async Task<BaseResponse> BookConsultationAsync(string patientId, ConsultationBookingReq req)
        {
            // Không cho phép đặt lịch trong quá khứ
            if (req.ScheduledDate.Date < DateTime.Today)
                return BaseResponse.Fail("Không thể đặt lịch trong quá khứ.");

            if (req.ScheduledDate.Date > DateTime.Today.AddMonths(3))
                return BaseResponse.Fail("Không thể đặt lịch quá xa hiện tại (tối đa 3 tháng).");

            string counselorId = req.CounselorId;

            // Nếu không chỉ định tư vấn viên, tự động gán tối ưu
            if (string.IsNullOrEmpty(counselorId))
            {
                // Lấy danh sách counselor có ca làm việc, còn available, và active
                var availableCounselors = await _scheduleService.GetAvailableCounselors(req.ScheduledDate, req.TimeSlot);
                if (!availableCounselors.Any())
                    return BaseResponse.Fail("Không có tư vấn viên rảnh vào thời gian này. Vui lòng chọn thời gian khác hoặc liên hệ quản trị viên.");

                // Lọc counselor còn hoạt động (không bị khóa)
                var activeCounselors = new List<AppUser>();
                foreach (var c in availableCounselors)
                {
                    var user = await _userManager.FindByIdAsync(c.Id);
                    if (user != null && user.LockoutEnabled == false)
                        activeCounselors.Add(user);
                }
                if (!activeCounselors.Any())
                    return BaseResponse.Fail("Tất cả tư vấn viên rảnh đều đang bị khóa tài khoản. Vui lòng liên hệ quản trị viên.");

                // Ưu tiên counselor có ít lịch nhất trong ngày/ca đó
                var counselorWithBookingCount = new List<(AppUser Counselor, int Count)>();
                foreach (var c in activeCounselors)
                {
                    int count = await _context.ConsultationSchedules.CountAsync(x =>
                        x.CounselorId == c.Id &&
                        x.ScheduledDate.Date == req.ScheduledDate.Date &&
                        x.TimeSlot == req.TimeSlot &&
                        !x.IsCanceled);
                    counselorWithBookingCount.Add((c, count));
                }
                var minCount = counselorWithBookingCount.Min(x => x.Count);
                var bestCounselors = counselorWithBookingCount.Where(x => x.Count == minCount).Select(x => x.Counselor).ToList();
                // Random nếu nhiều counselor cùng số lượng booking
                var random = new Random();
                var selected = bestCounselors[random.Next(bestCounselors.Count)];
                counselorId = selected.Id;
            }

            // Kiểm tra counselor có ca làm việc không
            var isWorking = await _context.WorkingSchedules.AnyAsync(w =>
                w.CounselorId == counselorId &&
                w.WorkDate.Date == req.ScheduledDate.Date &&
                w.TimeSlot == req.TimeSlot &&
                w.IsAvailable);

            if (!isWorking)
                return BaseResponse.Fail($"Tư vấn viên đã chọn không làm việc vào thời gian này. Vui lòng chọn tư vấn viên khác hoặc thời gian khác.");

            // Kiểm tra counselor có đang bận không
            var isCounselorBusy = await _context.ConsultationSchedules.AnyAsync(c =>
                c.CounselorId == counselorId &&
                c.ScheduledDate.Date == req.ScheduledDate.Date &&
                c.TimeSlot == req.TimeSlot &&
                !c.IsCanceled);

            if (isCounselorBusy)
                return BaseResponse.Fail($"Tư vấn viên đã có lịch tư vấn vào thời gian này. Vui lòng chọn tư vấn viên khác hoặc thời gian khác.");

            // Kiểm tra bệnh nhân có trùng lịch không
            var isPatientBusy = await _context.ConsultationSchedules.AnyAsync(c =>
                c.PatientId == patientId &&
                c.ScheduledDate.Date == req.ScheduledDate.Date &&
                c.TimeSlot == req.TimeSlot &&
                !c.IsCanceled);

            if (isPatientBusy)
                return BaseResponse.Fail("Bạn đã có cuộc hẹn tư vấn vào thời gian này. Vui lòng chọn thời gian khác.");

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

            // Sinh mã chuyển khoản thân thiện
            if (booking.Id > 0)
            {
                var code = $"GHMS-{booking.ScheduledDate:yyyyMMdd}-{booking.Id.ToString().PadLeft(4, '0').Substring(booking.Id.ToString().Length > 4 ? booking.Id.ToString().Length - 4 : 0)}";
                booking.TransferCode = code;
                await _context.SaveChangesAsync();
            }

            // Gửi thông báo email cho bệnh nhân và tư vấn viên
            var patient = await _context.Users.FindAsync(patientId);
            var counselor = await _context.Users.FindAsync(counselorId);
            if (patient != null && counselor != null)
            {
                var subject = _notificationTemplates.BookingPendingSubject;
                var body = string.Format(_notificationTemplates.BookingPendingBody, patient.FullName, counselor.FullName, booking.ScheduledDate);
                await _emailService.SendEmailAsync(patient.Email, subject, body);
            }

            return BaseResponse.Ok(ToDto(booking), "Đã đặt lịch thành công, vui lòng chờ tư vấn viên xác nhận.");
        }

        public async Task<List<ConsultationDto>> GetBookingsByPatientAsync(string patientId)
        {
            var list = await _context.ConsultationSchedules
                .Where(c => c.PatientId == patientId)
                .OrderByDescending(c => c.ScheduledDate)
                .ToListAsync();
            return list.Select(ToDto).ToList();
        }

        public async Task<List<ConsultationDto>> GetAppointmentsByCounselorAsync(string counselorId)
        {
            var list = await _context.ConsultationSchedules
                .Where(c => c.CounselorId == counselorId)
                .OrderByDescending(c => c.ScheduledDate)
                .ToListAsync();
            return list.Select(ToDto).ToList();
        }

        public async Task<List<ConsultationDto>> GetAppointmentsByCounselorWithFilterAsync(
    string counselorId, DateTime? fromDate, DateTime? toDate, ConsultationStatus? status)
{
    var query = _context.ConsultationSchedules
        .Where(c => c.CounselorId == counselorId);

    if (fromDate.HasValue)
        query = query.Where(c => c.ScheduledDate.Date >= fromDate.Value.Date);

    if (toDate.HasValue)
        query = query.Where(c => c.ScheduledDate.Date <= toDate.Value.Date);

    if (status.HasValue)
        query = query.Where(c => c.Status == status.Value);

    var list = await query.OrderBy(c => c.ScheduledDate).ToListAsync();
    return list.Select(ToDto).ToList();
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

            // Tự động hoàn tiền nếu đủ điều kiện
            if (booking.PaymentId.HasValue)
            {
                var payment = await _context.Payments.FindAsync(booking.PaymentId.Value);
                if (payment != null && payment.Status == "paid")
                {
                    bool shouldRefund = false;
                    if (role == "Patient")
                    {
                        // Nếu patient huỷ trước 24h thì refund
                        var now = DateTime.UtcNow.AddHours(7);
                        if ((booking.ScheduledDate - now).TotalHours >= 24)
                            shouldRefund = true;
                    }
                    else if (role == "Counselor")
                    {
                        // Counselor huỷ luôn refund
                        shouldRefund = true;
                    }
                    if (shouldRefund)
                    {
                        // Gọi service refund (giả lập)
                        payment.Status = "refunded";
                        payment.RefundedAt = DateTime.UtcNow;
                        booking.Status = ConsultationStatus.Refunded;
                        // TODO: Nếu muốn gọi API refund MOMO thực tế, hãy gọi PaymentService.RefundPaymentAsync ở đây
                    }
                }
            }

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

            return BaseResponse.Ok(null, "Đã gửi đề xuất đổi lịch cho bệnh nhân.");
        }

        public async Task<BaseResponse> RespondRescheduleAsync(string patientId, RespondRescheduleReq req)
        {
            // 1. Kiểm tra và lấy proposal
            var proposal = await _context.RescheduleProposals
                .Include(p => p.ProposedSlots)
                .FirstOrDefaultAsync(p => p.Id == req.ProposalId && p.PatientId == patientId);

            if (proposal == null) 
                return BaseResponse.Fail("Không tìm thấy đề xuất đổi lịch.");

            // 2. Kiểm tra proposal chưa được xử lý
            if (proposal.PatientAccepted.HasValue)
                return BaseResponse.Fail("Đề xuất này đã được xử lý trước đó.");

            // 3. Kiểm tra proposal không quá cũ (ví dụ: 7 ngày)
            if (proposal.CreatedAt < DateTime.UtcNow.AddDays(-7))
                return BaseResponse.Fail("Đề xuất này đã hết hạn (quá 7 ngày).");

            // 4. Xử lý phản hồi của bệnh nhân
            proposal.PatientAccepted = req.Accept;

            if (req.Accept)
            {
                // 5. Kiểm tra slot được chọn
                if (req.SelectedSlot == null)
                    return BaseResponse.Fail("Vui lòng chọn một khung giờ phù hợp.");

                var selectedSlot = proposal.ProposedSlots.FirstOrDefault(s =>
                    s.Date == req.SelectedSlot.Date && s.TimeSlot == req.SelectedSlot.TimeSlot);

                if (selectedSlot == null)
                    return BaseResponse.Fail("Khung giờ được chọn không hợp lệ.");

                // 6. Kiểm tra slot không trong quá khứ
                if (selectedSlot.Date.Date < DateTime.Today)
                    return BaseResponse.Fail("Không thể chọn khung giờ trong quá khứ.");

                // 7. Kiểm tra counselor vẫn rảnh vào thời gian đó
                var isCounselorAvailable = await _context.WorkingSchedules.AnyAsync(w =>
                    w.CounselorId == proposal.CounselorId &&
                    w.WorkDate.Date == selectedSlot.Date.Date &&
                    w.TimeSlot == (TimeSlot)selectedSlot.TimeSlot &&
                    w.IsAvailable);

                if (!isCounselorAvailable)
                    return BaseResponse.Fail("Tư vấn viên không còn rảnh vào khung giờ này.");

                // 8. Kiểm tra counselor không có lịch khác vào thời gian đó
                var isCounselorBusy = await _context.ConsultationSchedules.AnyAsync(c =>
                    c.CounselorId == proposal.CounselorId &&
                    c.ScheduledDate.Date == selectedSlot.Date.Date &&
                    c.TimeSlot == (TimeSlot)selectedSlot.TimeSlot &&
                    !c.IsCanceled);

                if (isCounselorBusy)
                    return BaseResponse.Fail("Tư vấn viên đã có lịch khác vào khung giờ này.");

                // 9. Kiểm tra bệnh nhân không có lịch khác vào thời gian đó
                var isPatientBusy = await _context.ConsultationSchedules.AnyAsync(c =>
                    c.PatientId == patientId &&
                    c.ScheduledDate.Date == selectedSlot.Date.Date &&
                    c.TimeSlot == (TimeSlot)selectedSlot.TimeSlot &&
                    !c.IsCanceled);

                if (isPatientBusy)
                    return BaseResponse.Fail("Bạn đã có lịch khác vào khung giờ này.");

                // 10. Cập nhật proposal với slot được chọn
                proposal.SelectedSlotId = selectedSlot.Id;

                // 11. Tạo lịch tư vấn mới
                var newBooking = new ConsultationSchedule
                {
                    PatientId = proposal.PatientId,
                    CounselorId = proposal.CounselorId,
                    ScheduledDate = selectedSlot.Date,
                    TimeSlot = (TimeSlot)selectedSlot.TimeSlot,
                    Status = ConsultationStatus.Pending,
                    Notes = $"[Đặt lại lịch từ đề xuất #{proposal.Id}] Lý do: {proposal.Reason}",
                    IsCanceled = false
                };

                _context.ConsultationSchedules.Add(newBooking);

                // 12. Gửi email thông báo cho cả bệnh nhân và tư vấn viên
                var patient = await _context.Users.FindAsync(proposal.PatientId);
                var counselor = await _context.Users.FindAsync(proposal.CounselorId);
                
                if (patient != null && counselor != null)
                {
                    // Email cho bệnh nhân
                    var patientSubject = "Lịch tư vấn mới đã được xác nhận";
                    var patientBody = $@"
                        <h3>Xin chào {patient.FullName},</h3>
                        <p>Bạn đã xác nhận lịch tư vấn mới với tư vấn viên <b>{counselor.FullName}</b>.</p>
                        <p><strong>Thời gian:</strong> {selectedSlot.Date:HH:mm dd/MM/yyyy}</p>
                        <p><strong>Lý do đổi lịch:</strong> {proposal.Reason}</p>
                        <p>Vui lòng chờ tư vấn viên xác nhận lịch này.</p>";

                    await _emailService.SendEmailAsync(patient.Email, patientSubject, patientBody);

                    // Email cho tư vấn viên
                    var counselorSubject = "Bệnh nhân đã xác nhận lịch tư vấn mới";
                    var counselorBody = $@"
                        <h3>Xin chào {counselor.FullName},</h3>
                        <p>Bệnh nhân <b>{patient.FullName}</b> đã xác nhận lịch tư vấn mới.</p>
                        <p><strong>Thời gian:</strong> {selectedSlot.Date:HH:mm dd/MM/yyyy}</p>
                        <p><strong>Lý do đổi lịch:</strong> {proposal.Reason}</p>
                        <p>Vui lòng xác nhận lịch này trong hệ thống.</p>";

                    await _emailService.SendEmailAsync(counselor.Email, counselorSubject, counselorBody);
                }
            }
            else
            {
                // 13. Xử lý trường hợp từ chối
                var patient = await _context.Users.FindAsync(proposal.PatientId);
                var counselor = await _context.Users.FindAsync(proposal.CounselorId);
                
                if (patient != null && counselor != null)
                {
                    // Email thông báo từ chối cho tư vấn viên
                    var counselorSubject = "Bệnh nhân đã từ chối đề xuất đổi lịch";
                    var counselorBody = $@"
                        <h3>Xin chào {counselor.FullName},</h3>
                        <p>Bệnh nhân <b>{patient.FullName}</b> đã từ chối đề xuất đổi lịch tư vấn.</p>
                        <p><strong>Lý do đổi lịch ban đầu:</strong> {proposal.Reason}</p>
                        <p>Vui lòng liên hệ trực tiếp với bệnh nhân để sắp xếp lịch khác.</p>";

                    await _emailService.SendEmailAsync(counselor.Email, counselorSubject, counselorBody);
                }
            }

            // 14. Lưu thay đổi
            await _context.SaveChangesAsync();

            return BaseResponse.Ok(null, req.Accept 
                ? "Đã xác nhận lịch tư vấn mới thành công. Vui lòng chờ tư vấn viên xác nhận." 
                : "Đã từ chối đề xuất đổi lịch. Tư vấn viên sẽ được thông báo.");
        }

        /// <summary>
        /// Đánh dấu bệnh nhân vắng mặt (chỉ tư vấn viên mới có quyền)
        /// </summary>
        public async Task<BaseResponse> MarkPatientNoShowAsync(int consultationId, string counselorId)
        {
            var consultation = await _context.ConsultationSchedules
                .Include(c => c.Patient)
                .Include(c => c.Counselor)
                .FirstOrDefaultAsync(c => c.Id == consultationId);

            if (consultation == null)
                return BaseResponse.Fail("Không tìm thấy lịch tư vấn.");

            if (consultation.CounselorId != counselorId)
                return BaseResponse.Fail("Bạn không có quyền thực hiện hành động này.");

            if (consultation.IsCanceled)
                return BaseResponse.Fail("Lịch tư vấn này đã bị hủy.");

            if (consultation.Status == ConsultationStatus.Completed)
                return BaseResponse.Fail("Lịch tư vấn này đã hoàn thành.");

            if (consultation.Status == ConsultationStatus.NoShow)
                return BaseResponse.Fail("Lịch tư vấn này đã được đánh dấu vắng mặt.");

            // Kiểm tra buổi tư vấn đã kết thúc chưa (dựa trên ca làm việc)
            var consultationEndTime = consultation.ScheduledDate.Date.Add(TimeSlotHelper.GetDefaultEndTime(consultation.TimeSlot));
            var now = DateTime.UtcNow.AddHours(7); // Múi giờ Việt Nam
            if (now < consultationEndTime)
                return BaseResponse.Fail($"Buổi tư vấn chưa kết thúc. Ca {TimeSlotHelper.GetTimeSlotName(consultation.TimeSlot)} kết thúc lúc {consultationEndTime:HH:mm}.");

            // Cập nhật trạng thái
            consultation.Status = ConsultationStatus.NoShow;
            consultation.Notes += $"\n[NoShow]: Đánh dấu vắng mặt bởi {consultation.Counselor?.FullName} vào {DateTime.UtcNow:dd/MM/yyyy HH:mm}";

            await _context.SaveChangesAsync();

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

            return BaseResponse.Ok(null, "Đã đánh dấu bệnh nhân vắng mặt và gửi thông báo.");
        }

        /// <summary>
        /// Lấy danh sách lịch tư vấn có thể đánh dấu NoShow (đã kết thúc nhưng chưa được xử lý)
        /// </summary>
        public async Task<List<ConsultationDto>> GetConsultationsForNoShowCheckAsync(string counselorId)
        {
            var today = DateTime.UtcNow.AddHours(7).Date; // Múi giờ Việt Nam
            var now = DateTime.UtcNow.AddHours(7);

            var list = await _context.ConsultationSchedules
                .Include(c => c.Patient)
                .Where(c => c.CounselorId == counselorId
                    && !c.IsCanceled
                    && c.Status == ConsultationStatus.Confirmed
                    && c.ScheduledDate.Date == today
                    && now >= c.ScheduledDate.Date.Add(TimeSlotHelper.GetDefaultEndTime(c.TimeSlot)))
                .OrderByDescending(c => c.ScheduledDate)
                .ToListAsync();
            return list.Select(ToDto).ToList();
        }

        /// <summary>
        /// Lấy danh sách tất cả tư vấn viên (cho form đặt lịch)
        /// </summary>
        public async Task<List<AppUser>> GetAllCounselorsAsync()
        {
            var counselors = new List<AppUser>();
            var allUsers = await _userManager.Users.ToListAsync();
            
            foreach (var user in allUsers)
            {
                var roles = await _userManager.GetRolesAsync(user);
                if (roles.Contains("Counselor"))
                {
                    counselors.Add(new AppUser
                    {
                        Id = user.Id,
                        FullName = user.FullName,
                        Email = user.Email,
                        PhoneNumber = user.PhoneNumber
                    });
                }
            }
            
            return counselors;
        }

        private static ConsultationDto ToDto(ConsultationSchedule c)
        {
            return new ConsultationDto
            {
                Id = c.Id,
                PatientId = c.PatientId,
                CounselorId = c.CounselorId,
                ScheduledDate = c.ScheduledDate,
                TimeSlot = (int)c.TimeSlot,
                Status = (int)c.Status,
                Notes = c.Notes,
                IsCanceled = c.IsCanceled,
                TransferCode = c.TransferCode
            };
        }
    }

    public class ConsultationDto
    {
        public int Id { get; set; }
        public string? PatientId { get; set; }
        public string? CounselorId { get; set; }
        public DateTime ScheduledDate { get; set; }
        public int TimeSlot { get; set; }
        public int Status { get; set; }
        public string? Notes { get; set; }
        public bool IsCanceled { get; set; }
        public string? TransferCode { get; set; }
    }
}
