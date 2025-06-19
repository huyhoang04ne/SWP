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
            var lastCycle = await _context.MenstrualCycles
                .Where(x => x.UserId == userId)
                .OrderByDescending(x => x.StartDate)
                .FirstOrDefaultAsync();

            int cycleLength = 0;
            if (lastCycle != null)
                cycleLength = (req.StartDate - lastCycle.StartDate).Days;

            var cycle = new MenstrualCycle
            {
                UserId = userId,
                StartDate = req.StartDate,
                PeriodLength = req.PeriodLength,
                CycleLength = cycleLength
            };

            _context.MenstrualCycles.Add(cycle);
            await _context.SaveChangesAsync();
        }

        public async Task<FertileWindowRsp?> GetFertileWindowAsync(string userId)
        {
            var lastCycle = await _context.MenstrualCycles
                .Where(x => x.UserId == userId && x.CycleLength > 0)
                .OrderByDescending(x => x.StartDate)
                .FirstOrDefaultAsync();

            if (lastCycle == null) return null;

            int mid = lastCycle.CycleLength / 2;
            DateTime ovulation = lastCycle.StartDate.AddDays(mid);

            return new FertileWindowRsp
            {
                OvulationDate = ovulation,
                FertileStart = ovulation.AddDays(-3),
                FertileEnd = ovulation.AddDays(3)
            };
        }
    }

}
