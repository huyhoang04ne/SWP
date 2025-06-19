using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GHMS.DAL.Models
{
    public class MedicationReminder
    {
        [Key]
        public string Id { get; set; }

        [Required]
        [ForeignKey("User")]
        public string UserId { get; set; }

        [Required]
        public TimeSpan ReminderTime { get; set; }

        [Required]
        [MaxLength(255)]
        public string Frequency { get; set; } = "Daily";

        [MaxLength(1000)]
        public string? Message { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

        // Navigation property
        public virtual AppUser User { get; set; }
    }
}
