using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GHMS.Common.Req
{
    public class MenstrualCycleCreateReq
    {
        public List<DateTime> PeriodDates { get; set; } = new(); 
    }
}