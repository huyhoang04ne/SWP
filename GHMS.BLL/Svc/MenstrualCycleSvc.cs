using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GHMS.Common.BLL;
using GHMS.Common.Resp;
using GHMS.DAL.Models;
using GHMS.DAL.Repositories;

namespace GHMS.BLL.Svc
{
    public class MenstrualCycleSvc : GenericSvc<MenstrualCycle>
    {
        private readonly MenstrualCycleRep _rep;
        public MenstrualCycleSvc(MenstrualCycleRep rep) : base(rep)
        {
            _rep = rep;
        }

        // Calculate ovulation and fertility window
        public SingleRsp ComputeWindow(int id)
        {
            var res = Get(id);
            var cycle = res.Data as MenstrualCycle;
            if (cycle == null) { res.Error = "Not found"; return res; }

            var ovulation = cycle.CycleStartDate.AddDays(cycle.AverageLength - 14);
            cycle.OvulationDate = ovulation;
            cycle.FertilityWindowStart = ovulation.AddDays(-5);
            cycle.FertilityWindowEnd = ovulation.AddDays(5);
            _rep.Update(cycle);

            return new SingleRsp { Data = cycle };
        }

        public int DaysUntilNextCycle(string userId)
        {
            var nextStart = _rep.GetNextOvulation(userId)?.AddDays(14);
            if (!nextStart.HasValue) return -1;
            return (nextStart.Value.Date - DateTime.UtcNow.Date).Days;
        }

        public string TodayFertilityStatus(string userId)
        {
            var cycle = _rep.GetCyclesByUser(userId)
                            .OrderByDescending(c => c.CycleStartDate)
                            .FirstOrDefault();
            if (cycle == null || !cycle.FertilityWindowStart.HasValue)
                return "Không xác định";

            var today = DateTime.UtcNow.Date;
            return (cycle.FertilityWindowStart <= today && today <= cycle.FertilityWindowEnd)
                ? "Cao" : "Thấp";
        }
    }
}
