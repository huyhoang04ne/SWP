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
            int created = 0, skipped = 0;
            
            // Debug: log request
            Console.WriteLine($"AssignShiftAsync - CounselorIds: {string.Join(",", req.CounselorIds)}");
            Console.WriteLine($"AssignShiftAsync - Assignments count: {req.Assignments?.Count ?? 0}");
            
            foreach (var counselorId in req.CounselorIds)
            {
                foreach (var assignment in req.Assignments)
                {
                    var date = assignment.Date;
                    
                    // XÓA HẾT CA CŨ của counselor trong ngày này trước khi thêm mới
                    var oldShifts = _context.WorkingSchedules.Where(w => w.CounselorId == counselorId && w.WorkDate.Date == date.Date);
                    _context.WorkingSchedules.RemoveRange(oldShifts);
                    await _context.SaveChangesAsync();
                    
                    // Thêm lại các ca mới - CHỈ những ca được tick cho ngày này
                    foreach (var slot in assignment.Shifts)
                    {
                        var schedule = new WorkingSchedule
                        {
                            CounselorId = counselorId,
                            WorkDate = date,
                            TimeSlot = (TimeSlot)slot,
                            Notes = req.Notes,
                            IsAvailable = true,
                            AssignedBy = req.AssignedBy,
                            IsAutoAssigned = req.IsAutoAssigned
                        };
                        _context.WorkingSchedules.Add(schedule);
                        created++;
                        Console.WriteLine($"Created shift {slot} for counselor {counselorId} on {date}");
                    }
                }
            }
            await _context.SaveChangesAsync();
            return BaseResponse.Ok(new { created, skipped }, $"Đã phân {created} ca (đã cập nhật lại các ca cho ngày đã chọn).");
        }

        public async Task<List<WorkingSchedule>> GetScheduleByCounselorAsync(string counselorId)
        {
            return await _context.WorkingSchedules
                .Where(w => w.CounselorId == counselorId && w.IsAvailable)
                .OrderBy(w => w.WorkDate)
                .ToListAsync();
        }

        public async Task<List<WorkingSchedule>> GetScheduleByCounselorAsync(string counselorId, DateTime? fromDate, DateTime? toDate)
        {
            var query = _context.WorkingSchedules
                .Where(w => w.CounselorId == counselorId && w.IsAvailable);

            if (fromDate.HasValue)
                query = query.Where(w => w.WorkDate.Date >= fromDate.Value.Date);

            if (toDate.HasValue)
                query = query.Where(w => w.WorkDate.Date <= toDate.Value.Date);

            return await query.OrderBy(w => w.WorkDate).ToListAsync();
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

        public async Task<List<AvailableSlotDto>> GetAvailableSlotsAsync(DateTime fromDate, DateTime toDate, string? counselorId = null)
        {
            var result = new List<AvailableSlotDto>();
            var days = Enumerable.Range(0, (toDate - fromDate).Days + 1)
                                 .Select(offset => fromDate.AddDays(offset))
                                 .ToList();

            for (int i = 0; i < days.Count; i++)
            {
                var day = days[i];
                var availableTimeSlots = new List<int>();
                for (int slot = 0; slot <= 2; slot++)
                {
                    if (!string.IsNullOrEmpty(counselorId))
                    {
                        // Kiểm tra tư vấn viên có ca làm việc và chưa bị book chưa
                        var isWorking = await _context.WorkingSchedules.AnyAsync(w =>
                            w.CounselorId == counselorId &&
                            w.WorkDate.Date == day.Date &&
                            w.TimeSlot == (TimeSlot)slot &&
                            w.IsAvailable);

                        var isBusy = await _context.ConsultationSchedules.AnyAsync(c =>
                            c.CounselorId == counselorId &&
                            c.ScheduledDate.Date == day.Date &&
                            c.TimeSlot == (TimeSlot)slot &&
                            !c.IsCanceled);

                        if (isWorking && !isBusy)
                            availableTimeSlots.Add(slot);
                    }
                    else
                    {
                        // Kiểm tra còn ít nhất 1 tư vấn viên rảnh ca này
                        var availableCounselors = await GetAvailableCounselors(day, (TimeSlot)slot);
                        if (availableCounselors.Any())
                            availableTimeSlots.Add(slot);
                    }
                }
                if (availableTimeSlots.Any())
                {
                    result.Add(new AvailableSlotDto
                    {
                        Date = day.Date,
                        TimeSlots = availableTimeSlots
                    });
                }
            }
            return result;
        }

        public async Task<List<object>> GetCounselorWorkingSlotsAsync(string counselorId, DateTime fromDate, DateTime toDate)
        {
            var result = new List<object>();
            var days = Enumerable.Range(0, (toDate - fromDate).Days + 1)
                                 .Select(offset => fromDate.AddDays(offset))
                                 .ToList();

            for (int i = 0; i < days.Count; i++)
            {
                var day = days[i];
                var workingSlots = new List<object>();
                
                for (int slot = 0; slot <= 2; slot++)
                {
                    // Kiểm tra counselor có ca làm việc không
                    var isWorking = await _context.WorkingSchedules.AnyAsync(w =>
                        w.CounselorId == counselorId &&
                        w.WorkDate.Date == day.Date &&
                        w.TimeSlot == (TimeSlot)slot &&
                        w.IsAvailable);

                    if (isWorking)
                    {
                        // Kiểm tra ca có bị book không
                        var isBusy = await _context.ConsultationSchedules.AnyAsync(c =>
                            c.CounselorId == counselorId &&
                            c.ScheduledDate.Date == day.Date &&
                            c.TimeSlot == (TimeSlot)slot &&
                            !c.IsCanceled);

                        workingSlots.Add(new
                        {
                            timeSlot = slot,
                            isAvailable = !isBusy,
                            status = isBusy ? "booked" : "available"
                        });
                    }
                }
                
                if (workingSlots.Any())
                {
                    result.Add(new
                    {
                        date = day.Date,
                        workingSlots = workingSlots
                    });
                }
            }
            return result;
        }
    }
}
