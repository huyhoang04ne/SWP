using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GHMS.Common.Req;

namespace GHMS.Common.Req
{
    public class MedicationReminderReq
    {
        public int Id { get; set; }
        public Guid UserId { get; set; }
        public TimeSpan ReminderTime { get; set; } // Time of day for reminder
        public RegimenType RegimenType { get; set; }
        public string Message { get; set; }        // Custom reminder text
    }
}
