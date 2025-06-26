using System.ComponentModel.DataAnnotations;

namespace GHMS.Common.Req
{
    public class SetScheduleReq
    {
        [Range(21, 28)]
        public int PillType { get; set; } // 21 hoặc 28

        [Range(0, 23)]
        public int ReminderHour { get; set; }

        [Range(0, 59)]
        public int ReminderMinute { get; set; }
    }
}
