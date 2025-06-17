using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GHMS.Common.Req
{
    public class MedicationReminderReq
    {
        public string UserId { get; set; }
        public TimeSpan ReminderTime { get; set; } // Time of day for reminder
        public string Frequency { get; set; }      // "Daily" or "Weekly"
        public string Message { get; set; }        // Custom reminder text
    }
}
