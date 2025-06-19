using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace GHMS.DAL.Models
{
    public class MenstrualPeriodDay
    {
        [Key]
        public string Id { get; set; }

        [Required]
        [ForeignKey("MenstrualCycle")]
        public string CycleId { get; set; }

        [Required]
        public DateTime Date { get; set; }

        public bool HasPeriod { get; set; }

        public string? Notes { get; set; }

        // Navigation property
        public virtual MenstrualCycle MenstrualCycle { get; set; }
    }
}

