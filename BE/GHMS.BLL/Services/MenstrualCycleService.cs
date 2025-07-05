using GHMS.Common.Req;
using GHMS.Common.Rsp;
using GHMS.DAL.Data;
using GHMS.DAL.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace GHMS.BLL.Services
{
    public class MenstrualCycleService
    {
        private readonly GHMSContext _context;
        private readonly UserManager<AppUser> _userManager;

        public MenstrualCycleService(GHMSContext context, UserManager<AppUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public async Task AddPeriodEntryAsync(string userId, MenstrualCycleCreateReq req)
        {
            // Validate input
            if (req.PeriodDates == null || !req.PeriodDates.Any())
                throw new ArgumentException("Danh sách ngày kinh không được để trống.");

            // Validate không có ngày trùng lặp
            var distinctDates = req.PeriodDates.Select(d => d.Date).Distinct().ToList();
            if (distinctDates.Count != req.PeriodDates.Count)
                throw new ArgumentException("Không được phép nhập ngày trùng lặp.");

            var currentDate = DateTime.UtcNow.AddHours(7).Date;

            var futureDates = req.PeriodDates.Where(d => d.Date > currentDate).ToList();
            if (futureDates.Any())
                throw new ArgumentException($"Không được phép nhập ngày trong tương lai. Các ngày không hợp lệ: {string.Join(", ", futureDates.Select(d => d.ToString("dd/MM/yyyy")))}");

            var groups = GroupConsecutivePeriodDays(req.PeriodDates.Select(d => d.Date).ToList());
            
            // Validate độ dài của mỗi kỳ kinh (3-7 ngày) và khoảng cách giữa các ngày
            foreach (var group in groups)
            {
                // Validate độ dài kỳ kinh
                if (group.Count < 3 || group.Count > 7)
                {
                    var startDate = group.First();
                    var endDate = group.Last();
                    throw new ArgumentException($"Kỳ kinh từ {startDate:dd/MM/yyyy} đến {endDate:dd/MM/yyyy} có độ dài {group.Count} ngày không hợp lệ. Độ dài kỳ kinh phải từ 3-7 ngày.");
                }
                
                // Validate khoảng cách giữa các ngày trong cùng kỳ kinh (phải liên tiếp)
                for (int i = 1; i < group.Count; i++)
                {
                    var gap = (group[i] - group[i - 1]).Days;
                    if (gap > 1)
                    {
                        throw new ArgumentException($"Các ngày trong kỳ kinh phải liên tiếp. Có khoảng cách {gap} ngày giữa {group[i - 1]:dd/MM/yyyy} và {group[i]:dd/MM/yyyy}.");
                    }
                }
            }

            // Validate độ dài chu kỳ kinh nguyệt (21-35 ngày từ ngày đầu đến ngày đầu)
            if (groups.Count >= 2)
            {
                for (int i = 0; i < groups.Count - 1; i++)
                {
                    var currentCycleStart = groups[i].First();
                    var nextCycleStart = groups[i + 1].First();
                    var cycleLength = (nextCycleStart - currentCycleStart).Days;
                    
                    if (cycleLength < 21 || cycleLength > 35)
                    {
                        throw new ArgumentException($"Chu kỳ kinh nguyệt từ {currentCycleStart:dd/MM/yyyy} đến {nextCycleStart:dd/MM/yyyy} có độ dài {cycleLength} ngày không hợp lệ. Độ dài chu kỳ phải từ 21-35 ngày.");
                    }
                }
            }

            var oldCycles = await _context.MenstrualCycles
                .Where(x => x.UserId == userId)
                .Include(x => x.PeriodDays)
                .ToListAsync();
            foreach (var cycle in oldCycles)
            {
                _context.MenstrualPeriodDays.RemoveRange(cycle.PeriodDays);
                _context.MenstrualCycles.Remove(cycle);
            }
            await _context.SaveChangesAsync();

            foreach (var group in groups)
            {
                var start = group.First();

                var cycle = new MenstrualCycle
                {
                    UserId = userId,
                    StartDate = start,
                    PeriodLength = group.Count,
                    CycleLength = 0
                };

                _context.MenstrualCycles.Add(cycle);
                await _context.SaveChangesAsync();

                foreach (var date in group)
                {
                    _context.MenstrualPeriodDays.Add(new MenstrualPeriodDay
                    {
                        Id = Guid.NewGuid().ToString(),
                        CycleId = cycle.Id,
                        Date = date,
                        HasPeriod = true
                    });
                }
            }

            await _context.SaveChangesAsync();
            await UpdateCycleLengthsAsync(userId);
        }

        private async Task UpdateCycleLengthsAsync(string userId)
        {
            var userCycles = await _context.MenstrualCycles
                .Where(x => x.UserId == userId)
                .OrderBy(x => x.StartDate)
                .ToListAsync();

            for (int i = 0; i < userCycles.Count; i++)
            {
                if (i + 1 < userCycles.Count)
                {
                    var cycleLength = (userCycles[i + 1].StartDate - userCycles[i].StartDate).Days;
                    
                    // Validate độ dài chu kỳ (21-35 ngày)
                    if (cycleLength < 21 || cycleLength > 35)
                    {
                        throw new ArgumentException($"Chu kỳ kinh nguyệt từ {userCycles[i].StartDate:dd/MM/yyyy} đến {userCycles[i + 1].StartDate:dd/MM/yyyy} có độ dài {cycleLength} ngày không hợp lệ. Độ dài chu kỳ phải từ 21-35 ngày.");
                    }
                    
                    userCycles[i].CycleLength = cycleLength;
                }
                else
                {
                    userCycles[i].CycleLength = PredictCycleLength(userCycles);
                }

                _context.MenstrualCycles.Update(userCycles[i]);
            }

            await _context.SaveChangesAsync();
        }

        private List<List<DateTime>> GroupConsecutivePeriodDays(List<DateTime> dates)
        {
            dates = dates.OrderBy(d => d).ToList();
            var result = new List<List<DateTime>>();
            var group = new List<DateTime>();

            for (int i = 0; i < dates.Count; i++)
            {
                if (i == 0 || (dates[i] - dates[i - 1]).Days <= 1)
                    group.Add(dates[i]);
                else
                {
                    result.Add(new List<DateTime>(group));
                    group.Clear();
                    group.Add(dates[i]);
                }
            }

            if (group.Any()) 
            {
                result.Add(group);
            }
            
            return result;
        }

        private int PredictCycleLength(List<MenstrualCycle> cycles)
        {
            var recent = cycles
                .Where(x => x.CycleLength > 0)
                .OrderByDescending(x => x.StartDate)
                .Take(5)
                .Select(x => x.CycleLength)
                .ToList();

            return recent.Any() ? (int)Math.Round(recent.Average()) : 28;
        }

        public async Task<CyclePredictionRsp?> GetCurrentCyclePredictionAsync(string userId)
        {
            var cycles = await _context.MenstrualCycles
                .Where(x => x.UserId == userId)
                .OrderBy(x => x.StartDate)
                .ToListAsync();

            if (!cycles.Any()) return null;

            var latest = cycles.Last();
            int predictedLength = latest.CycleLength > 0 ? latest.CycleLength : PredictCycleLength(cycles);

            return new CyclePredictionRsp
            {
                StartDate = latest.StartDate,
                PeriodLength = latest.PeriodLength,
                CycleLength = predictedLength,
                PredictedNextCycleStartDate = latest.StartDate.AddDays(predictedLength)
            };
        }

        public async Task<FertileWindowRsp?> GetFertileWindowAsync(string userId)
        {
            var cycles = await _context.MenstrualCycles
                .Where(x => x.UserId == userId)
                .OrderByDescending(x => x.StartDate)
                .ToListAsync();

            if (!cycles.Any()) return null;

            var latest = cycles.First();
            int cycleLength = latest.CycleLength > 0 ? latest.CycleLength : PredictCycleLength(cycles);

            // Theo ACOG: Ngày rụng trứng = StartDate + (CycleLength - 14)
            DateTime ovulation = latest.StartDate.AddDays(cycleLength - 14);
            // Fertile window: ovulation - 5 đến ovulation + 1
            DateTime fertileStart = ovulation.AddDays(-5);
            DateTime fertileEnd = ovulation.AddDays(1);

            return new FertileWindowRsp
            {
                StartDate = latest.StartDate,
                OvulationDate = ovulation,
                FertileStart = fertileStart,
                FertileEnd = fertileEnd,
                CycleLength = cycleLength
            };
        }

        public async Task<List<DateTime>> GetAllPeriodDatesAsync(string userId)
        {
            return await _context.MenstrualPeriodDays
                .Where(x => x.MenstrualCycle.UserId == userId && x.HasPeriod)
                .Select(x => x.Date.Date)
                .Distinct()
                .ToListAsync();
        }

        public async Task<List<MenstrualCycle>> GetRecentCyclesAsync(string userId, int count = 5)
        {
            return await _context.MenstrualCycles
                .Where(x => x.UserId == userId && x.CycleLength > 0)
                .OrderByDescending(x => x.StartDate)
                .Take(count)
                .OrderBy(x => x.StartDate)
                .ToListAsync();
        }


        public async Task<List<CyclePredictionRsp>> GetAllCyclePredictionsAsync(string userId)
        {
            var cycles = await _context.MenstrualCycles
                .Where(x => x.UserId == userId)
                .OrderBy(x => x.StartDate)
                .ToListAsync();

            var result = new List<CyclePredictionRsp>();
            for (int i = 0; i < cycles.Count; i++)
            {
                var current = cycles[i];
                int predictedLength = current.CycleLength > 0 ? current.CycleLength : PredictCycleLength(cycles);

                // Tính toán các trường bổ sung
                var ovulation = current.StartDate.AddDays(predictedLength - 14);
                var fertileStart = ovulation.AddDays(-5);
                var fertileEnd = ovulation.AddDays(1);
                string status = "Low";
                var today = DateTime.UtcNow.Date;
                if (today >= fertileStart.Date && today <= fertileEnd.Date)
                    status = "High";

                result.Add(new CyclePredictionRsp
                {
                    StartDate = current.StartDate,
                    PeriodLength = current.PeriodLength,
                    CycleLength = predictedLength,
                    PredictedNextCycleStartDate = current.StartDate.AddDays(predictedLength),
                    OvulationDate = ovulation,
                    FertileStart = fertileStart,
                    FertileEnd = fertileEnd,
                    Status = status
                });
            }
            return result;
        }
    }
}
