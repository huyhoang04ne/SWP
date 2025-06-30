using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GHMS.DAL.Models
{
    public class MedicationSchedule
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey("User")]
        public string UserId { get; set; } = default!;

        public DateTime StartDate { get; set; }
        public PillType PillType { get; set; }

        public int ReminderHour { get; set; }
        public int ReminderMinute { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual AppUser User { get; set; } = default!; // Gắn đúng quan hệ với AspNetUsers
        public virtual ICollection<MedicationReminder> Reminders { get; set; } = new List<MedicationReminder>();
    }
}
