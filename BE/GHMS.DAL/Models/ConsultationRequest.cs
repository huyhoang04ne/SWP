using GHMS.DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GHMS.DAL.Models
{
    public class ConsultationRequest
    {
        public Guid Id { get; set; }
        public string PatientId { get; set; }
        public AppUser Patient { get; set; }

        public string? CounselorId { get; set; } // null if auto-assigned
        public DateTime PreferredDate { get; set; }
        public TimeSlot PreferredSlot { get; set; }

        public string HealthConcern { get; set; }
        public ConsultationStatus Status { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
