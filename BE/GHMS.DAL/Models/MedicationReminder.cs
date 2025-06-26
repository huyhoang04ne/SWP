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
        public string ScheduleId { get; set; }

        public DateTime ReminderTime { get; set; }

        public bool IsTaken { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("ScheduleId")]
        public MedicationSchedule Schedule { get; set; }
    }
}
