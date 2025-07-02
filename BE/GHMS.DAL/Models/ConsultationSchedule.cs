using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace GHMS.DAL.Models
{
    public enum ConsultationStatus
    {
        Pending,
        Confirmed,
        Completed,
        Cancelled
    }

    public enum TimeSlot
    {
        Morning,
        Afternoon,
        Evening
    }

    public class ConsultationSchedule
    {
        [Key]
        public int Id { get; set; }

        public string PatientId { get; set; }
        public string CounselorId { get; set; }

        [ForeignKey("PatientId")]
        public AppUser Patient { get; set; }

        [ForeignKey("CounselorId")]
        public AppUser Counselor { get; set; }

        public DateTime ScheduledDate { get; set; }

        public TimeSlot TimeSlot { get; set; }

        public ConsultationStatus Status { get; set; }

        public bool IsCanceled { get; set; } = false;

        public string? Notes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
