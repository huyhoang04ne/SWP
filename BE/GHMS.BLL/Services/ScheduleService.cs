using GHMS.Common.Req;
using GHMS.Common.Rsp;
using GHMS.DAL.Data;
using GHMS.DAL.Models;
using Microsoft.EntityFrameworkCore;

namespace GHMS.BLL.Services
{
    public class ScheduleService
    {
        private readonly GHMSContext _context;

        public ScheduleService(GHMSContext context)
        {
            _context = context;
        }

        public async Task<BaseResponse> AssignShiftAsync(CounselorShiftReq req)
        {
            var exists = await _context.WorkingSchedules.AnyAsync(w =>
                w.CounselorId == req.CounselorId &&
                w.WorkDate.Date == req.WorkDate.Date &&
                w.TimeSlot == req.TimeSlot);

            if (exists)
                return BaseResponse.Fail("Counselor đã có lịch làm việc vào thời điểm này.");

            var schedule = new WorkingSchedule
            {
                CounselorId = req.CounselorId,
                WorkDate = req.WorkDate,
                TimeSlot = req.TimeSlot,
                Notes = req.Notes,
                IsAvailable = true
            };

            _context.WorkingSchedules.Add(schedule);
            await _context.SaveChangesAsync();
            return BaseResponse.Ok(null, "Xếp lịch thành công.");
        }

        public async Task<List<WorkingSchedule>> GetScheduleByCounselorAsync(string counselorId)
        {
            return await _context.WorkingSchedules
                .Where(w => w.CounselorId == counselorId && w.IsAvailable)
                .OrderBy(w => w.WorkDate)
                .ToListAsync();
        }

        public async Task<List<AppUser>> GetAvailableCounselors(DateTime date, TimeSlot slot)
        {
            var working = await _context.WorkingSchedules
                .Where(w => w.WorkDate.Date == date.Date && w.TimeSlot == slot && w.IsAvailable)
                .Select(w => w.CounselorId)
                .ToListAsync();

            var busy = await _context.ConsultationSchedules
                .Where(c => c.ScheduledDate.Date == date.Date && c.TimeSlot == slot && !c.IsCanceled)
                .Select(c => c.CounselorId)
                .ToListAsync();

            var available = working.Except(busy).ToList();

            return await _context.Users
                .Where(u => available.Contains(u.Id))
                .ToListAsync();
        }
    }
}
