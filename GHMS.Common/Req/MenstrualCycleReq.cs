using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GHMS.Common.Req
{
    public class MenstrualCycleReq
    {

        public DateTime CycleStartDate { get; set; }

        public string Symptoms { get; set; }

        public int AverageLength { get; set; }

        public string Notes { get; set; }
    }
}
