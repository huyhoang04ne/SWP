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
            {
                throw new ArgumentException($"Không được phép nhập ngày trong tương lai. Các ngày không hợp lệ: {string.Join(", ", futureDates.Select(d => d.ToString("dd/MM/yyyy")))}");
            }

            var existingDays = await _context.MenstrualPeriodDays
                .Where(x => x.MenstrualCycle.UserId == userId)
                .Include(x => x.MenstrualCycle)
                .ToListAsync();

            var toRemove = existingDays.Where(x => !req.PeriodDates.Contains(x.Date.Date)).ToList();
            _context.MenstrualPeriodDays.RemoveRange(toRemove);

            var existingDatesSet = existingDays.Select(x => x.Date.Date).ToHashSet();
            var newDates = req.PeriodDates.Select(d => d.Date).Except(existingDatesSet).ToList();

            var groups = GroupConsecutivePeriodDays(newDates);

            foreach (var group in groups)
            {
                var start = group.First();

                var cycle = await _context.MenstrualCycles
                    .FirstOrDefaultAsync(x => x.UserId == userId && x.StartDate.Date == start);

                if (cycle == null)
                {
                    cycle = new MenstrualCycle
                    {
                        UserId = userId,
                        StartDate = start,
                        PeriodLength = group.Count,
                        CycleLength = 0
                    };

                    _context.MenstrualCycles.Add(cycle);
                    await _context.SaveChangesAsync();
                }

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
                    var cycleGaps = new List<int>();
                    for (int j = i - 1; j >= 1 && cycleGaps.Count < 5; j--)
                    {
                        var gap = (userCycles[j].StartDate - userCycles[j - 1].StartDate).Days;
                        cycleGaps.Add(gap);
                    }

                    userCycles[i].CycleLength = cycleGaps.Any() ? (int)Math.Round(cycleGaps.Average()) : 28;
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
                result.Add(group);

            return result;
        }

        public async Task<object?> GetCurrentCyclePredictionAsync(string userId)
        {
            var cycles = await _context.MenstrualCycles
                .Where(x => x.UserId == userId)
                .OrderBy(x => x.StartDate)
                .ToListAsync();

            if (!cycles.Any())
                return null;

            var latest = cycles.Last();

            int predictedLength = latest.CycleLength;
            if (predictedLength == 0 || cycles.Count == 1)
            {
                var previous5 = cycles
                    .Take(cycles.Count - 1)
                    .Reverse()
                    .Where(x => x.CycleLength > 0)
                    .Take(5)
                    .Select(x => x.CycleLength)
                    .ToList();

                predictedLength = previous5.Any() ? (int)Math.Round(previous5.Average()) : 28;
            }

            return new
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

            if (cycles.Count == 0) return null;

            var latest = cycles.First();

            int cycleLength = latest.CycleLength;
            if (cycleLength == 0 || cycles.Count == 1)
            {
                var gaps = new List<int>();
                for (int i = 1; i < cycles.Count && gaps.Count < 5; i++)
                {
                    var gap = (cycles[i - 1].StartDate - cycles[i].StartDate).Days;
                    gaps.Add(gap);
                }

                cycleLength = gaps.Any() ? (int)Math.Round(gaps.Average()) : 28;
            }

            var ovulation = latest.StartDate.AddDays(cycleLength / 2);
            var fertileStart = ovulation.AddDays(-3);
            var fertileEnd = ovulation.AddDays(3);

            return new FertileWindowRsp
            {
                OvulationDate = ovulation,
                FertileStart = fertileStart,
                FertileEnd = fertileEnd
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

        private async Task<int> CalculatePredictedCycleLengthAsync(string userId)
        {
            var recentCycles = await _context.MenstrualCycles
                .Where(x => x.UserId == userId && x.CycleLength > 0)
                .OrderByDescending(x => x.StartDate)
                .Take(5)
                .Select(x => x.CycleLength)
                .ToListAsync();

            return recentCycles.Any() ? (int)Math.Round(recentCycles.Average()) : 28;
        }
    }
}