using Microsoft.VisualBasic;
using System.ComponentModel.DataAnnotations;
using GHMS.DAL.Models;

namespace GHMS.Common.Req
{
    public class SetScheduleReq
    {
        public PillType PillType { get; set; }
        public int ReminderHour { get; set; }
        public int ReminderMinute { get; set; }
    }
}
