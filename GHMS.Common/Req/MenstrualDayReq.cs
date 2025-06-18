using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace GHMS.Common.Req
{
    public class MenstrualDayReq
    {
        public int MenstrualCycleId { get; set; }    

        public DateTime Date { get; set; }

        public string? Symptoms { get; set; }

        public string? Notes { get; set; }

        public string? Mood { get; set; }

        public bool HasPeriod { get; set; }
    }
}
