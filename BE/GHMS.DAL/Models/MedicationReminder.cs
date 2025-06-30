using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GHMS.DAL.Models
{
    public class MedicationReminder
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        [ForeignKey("Schedule")]
        public int ScheduleId { get; set; }

        [Required]
        public DateTime ReminderTime { get; set; }

        public bool IsTaken { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property
        public virtual MedicationSchedule Schedule { get; set; } = default!;
    }
}
