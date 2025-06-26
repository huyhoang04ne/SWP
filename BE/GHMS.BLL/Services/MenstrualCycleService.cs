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

            // Kiểm tra ngày trong tương lai
            var futureDates = req.PeriodDates.Where(d => d.Date > currentDate).ToList();
            if (futureDates.Any())
            {
                throw new ArgumentException($"Không được phép nhập ngày trong tương lai. Các ngày không hợp lệ: {string.Join(", ", futureDates.Select(d => d.ToString("dd/MM/yyyy")))}");
            }

            // Gom nhóm các ngày liên tiếp được chọn
            var groups = GroupConsecutivePeriodDays(req.PeriodDates.Select(d => d.Date).ToList());
            var newStartDates = groups.Select(g => g.First().Date).ToHashSet();

            // Lấy toàn bộ các kỳ cũ của người dùng
            var oldCycles = await _context.MenstrualCycles
                .Where(x => x.UserId == userId)
                .Include(x => x.PeriodDays)
                .ToListAsync();

            // Xóa các kỳ không còn ngày bắt đầu trong danh sách mới
            var cyclesToDelete = oldCycles.Where(c => !newStartDates.Contains(c.StartDate.Date)).ToList();
            foreach (var cycle in cyclesToDelete)
            {
                _context.MenstrualPeriodDays.RemoveRange(cycle.PeriodDays);
                _context.MenstrualCycles.Remove(cycle);
            }

            await _context.SaveChangesAsync();

            // Thêm các kỳ mới
            foreach (var group in groups)
            {
                var start = group.First();

                // Tránh tạo trùng nếu kỳ này đã tồn tại
                var existingCycle = oldCycles.FirstOrDefault(c => c.StartDate.Date == start.Date);
                if (existingCycle != null) continue;

                var cycle = new MenstrualCycle
                {
                    UserId = userId,
                    StartDate = start,
                    PeriodLength = group.Count,
                    CycleLength = 0 // sẽ tính sau
                };

                _context.MenstrualCycles.Add(cycle);
                await _context.SaveChangesAsync(); // để lấy cycle.Id

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

            // Cập nhật độ dài chu kỳ
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
                    var gaps = new List<int>();
                    for (int j = i - 1; j >= 1 && gaps.Count < 5; j--)
                    {
                        var gap = (userCycles[j].StartDate - userCycles[j - 1].StartDate).Days;
                        gaps.Add(gap);
                    }

                    userCycles[i].CycleLength = gaps.Any() ? (int)Math.Round(gaps.Average()) : 28;
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

        public async Task<object?> GetCurrentCyclePredictionAsync(string userId)
        {
            var cycles = await _context.MenstrualCycles
                .Where(x => x.UserId == userId)
                .OrderBy(x => x.StartDate)
                .ToListAsync();

            if (!cycles.Any()) return null;

            var latest = cycles.Last();
            int predictedLength = latest.CycleLength;

            if (predictedLength == 0 || cycles.Count == 1)
            {
                var recent = cycles.Take(cycles.Count - 1)
                    .Reverse()
                    .Where(x => x.CycleLength > 0)
                    .Take(5)
                    .Select(x => x.CycleLength)
                    .ToList();

                predictedLength = recent.Any() ? (int)Math.Round(recent.Average()) : 28;
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

            if (!cycles.Any()) return null;

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
    }
}
