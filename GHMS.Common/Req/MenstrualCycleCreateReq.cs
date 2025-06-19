using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GHMS.Common.Req
{
    public class MenstrualCycleCreateReq
    {
        public DateTime StartDate { get; set; }
        public int PeriodLength { get; set; } // ví dụ: 5 ngày hành kinh
    }
}