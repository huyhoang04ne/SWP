using GHMS.Common.Req;
using GHMS.Common.Rsp;
using GHMS.DAL.Data;
using GHMS.DAL.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
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
            // Lấy ngày hiện tại theo múi giờ +07 (Việt Nam)
            var currentDate = DateTime.UtcNow.AddHours(7).Date; // 10:32 PM +07, 20/06/2025

            // Kiểm tra nếu có ngày trong tương lai
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
                    var lastCycle = await _context.MenstrualCycles
                        .Where(x => x.UserId == userId)
                        .OrderByDescending(x => x.StartDate)
                        .FirstOrDefaultAsync();

                    var cycleLength = lastCycle != null ? (start - lastCycle.StartDate).Days : 0;

                    cycle = new MenstrualCycle
                    {
                        UserId = userId,
                        StartDate = start,
                        PeriodLength = group.Count,
                        CycleLength = cycleLength
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

        public async Task<FertileWindowRsp?> GetFertileWindowAsync(string userId)
        {
            var latestCycles = await _context.MenstrualCycles
                .Where(x => x.UserId == userId)
                .OrderByDescending(x => x.StartDate)
                .Take(2)
                .ToListAsync();

            if (latestCycles.Count < 2) return null;

            var avgLength = (latestCycles[0].StartDate - latestCycles[1].StartDate).Days;
            var ovulation = latestCycles[0].StartDate.AddDays(avgLength - 14);

            return new FertileWindowRsp
            {
                OvulationDate = ovulation,
                FertileStart = ovulation.AddDays(-3),
                FertileEnd = ovulation.AddDays(3)
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