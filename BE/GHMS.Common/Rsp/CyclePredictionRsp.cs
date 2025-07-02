using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GHMS.Common.Rsp
{
    public class CyclePredictionRsp
    {
        public DateTime StartDate { get; set; }
        public int PeriodLength { get; set; }
        public int CycleLength { get; set; }
        public DateTime PredictedNextCycleStartDate { get; set; }
        public DateTime? OvulationDate { get; set; }
        public DateTime? FertileStart { get; set; }
        public DateTime? FertileEnd { get; set; }
        public string? Status { get; set; }
    }
}
