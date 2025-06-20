using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GHMS.DAL.Models
{
    public class MenstrualCycle
    {
        [Key]
        public int Id { get; set; }

        public string UserId { get; set; } = default!;
        public DateTime StartDate { get; set; }
        public int CycleLength { get; set; }
        public int PeriodLength { get; set; }

        public virtual ICollection<MenstrualPeriodDay> PeriodDays { get; set; } = new List<MenstrualPeriodDay>();
    }
}