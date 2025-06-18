using GHMS.Common.Req;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

// Enums for pill regimen types (21-day pack or 28-day pack)
public enum PillRegimenType
{
    Pack21,  // 21 active days, then 7-day break
    Pack28   // 21 active days, then 7 placebo days
}

// Updated MedicationReminder model: no PackStartDate, use MenstrualCycle to determine pack start
namespace GHMS.DAL.Models
{
    public class MedicationReminder
    {
        public int Id { get; set; }
        public string UserId { get; set; }               // FK to Users

        // Pill regimen property
        public RegimenType RegimenType { get; set; }
        public TimeSpan ReminderTime { get; set; }       // Time of day to remind

        public string MedicationName { get; set; }       // Name of medication
        public string Message { get; set; }              // Custom base text
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
