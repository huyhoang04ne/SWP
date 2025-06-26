using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GHMS.DAL.Models
{
    public class MedicationSchedule
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        public string UserId { get; set; }

        [Range(21, 28)]
        public int PillType { get; set; } // 21 hoặc 28 viên

        [Range(0, 23)]
        public int ReminderHour { get; set; }

        [Range(0, 59)]
        public int ReminderMinute { get; set; }

        public DateTime StartDate { get; set; } = DateTime.UtcNow.Date;

        [ForeignKey("UserId")]
        public AppUser User { get; set; }

        public virtual ICollection<MedicationReminder> Reminders { get; set; } = new List<MedicationReminder>();
    }
}
