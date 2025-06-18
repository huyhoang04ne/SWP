using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using GHMS.DAL.Models;
using GHMS.Common.Req;

namespace GHMS.DAL.Models
{
    public class MenstrualDay
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string UserId { get; set; }

        [Required]
        public DateTime Date { get; set; }

        [MaxLength(1000)]
        public string Symptoms { get; set; }

        [MaxLength(1000)]
        public string Notes { get; set; }

        [MaxLength(100)]
        public string Mood { get; set; }

        public bool HasPeriod { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }

        // Foreign key to MenstrualCycle
        [ForeignKey("MenstrualCycle")]
        public int MenstrualCycleId { get; set; }

        public virtual MenstrualCycle MenstrualCycle { get; set; }

        // Foreign key to User (optional depending on usage)
        [ForeignKey("UserId")]
        public virtual User User { get; set; }
    }
}