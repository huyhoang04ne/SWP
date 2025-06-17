using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GHMS.Common.Req
{
    public class MenstrualCycleReq
    {
        public string UserId { get; set; }      // FK to Users table
        public DateTime CycleStartDate { get; set; }  // Date of period start
        public int AverageLength { get; set; }   // Average cycle length
        public string Symptoms { get; set; }     // User-reported symptoms
        public string Notes { get; set; }        // Additional notes
    }
}
