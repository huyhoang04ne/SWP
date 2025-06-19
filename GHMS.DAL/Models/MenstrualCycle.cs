using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GHMS.DAL.Models
{
    public class MenstrualCycle
    {
        public int Id { get; set; }
        public string UserId { get; set; } = null!;
        public DateTime StartDate { get; set; } // ngày bắt đầu hành kinh
        public int PeriodLength { get; set; } // số ngày hành kinh
        public int CycleLength { get; set; }   // tính tự động: từ kỳ này tới kỳ sau
    }
}
