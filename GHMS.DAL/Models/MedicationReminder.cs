using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GHMS.DAL.Models
{
    public class MedicationReminder
    {
        public int Id { get; set; }
        public string UserId { get; set; }               // FK to Users
        public TimeSpan ReminderTime { get; set; }       // Time of day
        public string Frequency { get; set; }            // "Daily" or "Weekly"
        public string Message { get; set; }              // Custom text
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
