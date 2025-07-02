using GHMS.DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GHMS.Common.Req
{
    public class ConsultationBookingReq
    {
        public string? CounselorId { get; set; } // Optional nếu auto-assign
        public DateTime ScheduledDate { get; set; }
        public TimeSlot TimeSlot { get; set; }
        public string? Notes { get; set; }
    }
}