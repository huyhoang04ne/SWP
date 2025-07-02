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
            var currentDate = DateTime.UtcNow.AddHours(7).Date;

            var futureDates = req.PeriodDates.Where(d => d.Date > currentDate).ToList();
            if (futureDates.Any())
                throw new ArgumentException($"Không được phép nhập ngày trong tương lai. Các ngày không hợp lệ: {string.Join(", ", futureDates.Select(d => d.ToString("dd/MM/yyyy")))}");

            var groups = GroupConsecutivePeriodDays(req.PeriodDates.Select(d => d.Date).ToList());
            var newStartDates = groups.Select(g => g.First().Date).ToHashSet();

            var oldCycles = await _context.MenstrualCycles
                .Where(x => x.UserId == userId)
                .Include(x => x.PeriodDays)
                .ToListAsync();

            var cyclesToDelete = oldCycles.Where(c => !newStartDates.Contains(c.StartDate.Date)).ToList();
            foreach (var cycle in cyclesToDelete)
            {
                _context.MenstrualPeriodDays.RemoveRange(cycle.PeriodDays);
                _context.MenstrualCycles.Remove(cycle);
            }

            await _context.SaveChangesAsync();

            foreach (var group in groups)
            {
                var start = group.First();

                if (oldCycles.Any(c => c.StartDate.Date == start.Date))
                    continue;

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
                    userCycles[i].CycleLength = (userCycles[i + 1].StartDate - userCycles[i].StartDate).Days;
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

            if (group.Any()) result.Add(group);
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

            var ovulation = latest.StartDate.AddDays(cycleLength / 2);
            var fertileStart = ovulation.AddDays(-3);
            var fertileEnd = ovulation.AddDays(3);

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
                var ovulation = current.StartDate.AddDays(predictedLength / 2);
                var fertileStart = ovulation.AddDays(-3);
                var fertileEnd = ovulation.AddDays(3);
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
