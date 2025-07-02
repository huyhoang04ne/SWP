using GHMS.Common.Req;
using GHMS.Common.Rsp;
using GHMS.DAL.Data;
using GHMS.DAL.Models;
using Microsoft.EntityFrameworkCore;

namespace GHMS.BLL.Services
{
    public class ConsultationService
    {
        private readonly GHMSContext _context;

        public ConsultationService(GHMSContext context)
        {
            _context = context;
        }

        public async Task<BaseResponse> BookConsultationAsync(string patientId, ConsultationBookingReq req)
        {
            // ✅ 1. Kiểm tra counselor có ca làm việc không
            var isWorking = await _context.WorkingSchedules.AnyAsync(w =>
                w.CounselorId == req.CounselorId &&
                w.WorkDate.Date == req.ScheduledDate.Date &&
                w.TimeSlot == req.TimeSlot &&
                w.IsAvailable);

            if (!isWorking)
                return BaseResponse.Fail("Counselor không làm việc vào thời gian này.");

            // ✅ 2. Kiểm tra counselor có đang bận không
            var isCounselorBusy = await _context.ConsultationSchedules.AnyAsync(c =>
                c.CounselorId == req.CounselorId &&
                c.ScheduledDate.Date == req.ScheduledDate.Date &&
                c.TimeSlot == req.TimeSlot &&
                !c.IsCanceled);

            if (isCounselorBusy)
                return BaseResponse.Fail("Counselor đã có lịch tư vấn vào thời gian này.");

            // ✅ 3. Kiểm tra bệnh nhân có trùng lịch không
            var isPatientBusy = await _context.ConsultationSchedules.AnyAsync(c =>
                c.PatientId == patientId &&
                c.ScheduledDate.Date == req.ScheduledDate.Date &&
                c.TimeSlot == req.TimeSlot &&
                !c.IsCanceled);

            if (isPatientBusy)
                return BaseResponse.Fail("Bạn đã có cuộc hẹn tư vấn vào thời gian này.");

            // ✅ 4. Tạo cuộc hẹn
            var booking = new ConsultationSchedule
            {
                PatientId = patientId,
                CounselorId = req.CounselorId,
                ScheduledDate = req.ScheduledDate,
                TimeSlot = req.TimeSlot,
                Status = ConsultationStatus.Pending,
                Notes = req.Notes,
                IsCanceled = false
            };

            _context.ConsultationSchedules.Add(booking);
            await _context.SaveChangesAsync();

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

            return BaseResponse.Ok(null, "Cập nhật trạng thái thành công.");
        }
    }
}
