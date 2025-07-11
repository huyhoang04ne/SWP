using GHMS.DAL.Models;

namespace GHMS.Common.Helpers
{
    public static class TimeSlotHelper
    {
        /// <summary>
        /// Lấy giờ bắt đầu mặc định cho từng ca
        /// </summary>
        public static TimeSpan GetDefaultStartTime(TimeSlot timeSlot)
        {
            return timeSlot switch
            {
                TimeSlot.Morning => new TimeSpan(8, 0, 0),    // 08:00
                TimeSlot.Afternoon => new TimeSpan(13, 0, 0),  // 13:00
                TimeSlot.Evening => new TimeSpan(18, 0, 0),    // 18:00
                _ => new TimeSpan(8, 0, 0)
            };
        }

        /// <summary>
        /// Lấy giờ kết thúc mặc định cho từng ca
        /// </summary>
        public static TimeSpan GetDefaultEndTime(TimeSlot timeSlot)
        {
            return timeSlot switch
            {
                TimeSlot.Morning => new TimeSpan(11, 0, 0),   // 11:00
                TimeSlot.Afternoon => new TimeSpan(17, 0, 0),  // 17:00
                TimeSlot.Evening => new TimeSpan(21, 0, 0),    // 21:00
                _ => new TimeSpan(11, 0, 0)
            };
        }

        /// <summary>
        /// Lấy tên ca bằng tiếng Việt
        /// </summary>
        public static string GetTimeSlotName(TimeSlot timeSlot)
        {
            return timeSlot switch
            {
                TimeSlot.Morning => "Sáng",
                TimeSlot.Afternoon => "Chiều",
                TimeSlot.Evening => "Tối",
                _ => "Không xác định"
            };
        }

        /// <summary>
        /// Kiểm tra xem thời gian hiện tại có phải là 22:00 không
        /// </summary>
        public static bool IsNoShowNotificationTime()
        {
            var now = DateTime.UtcNow.AddHours(7); // Chuyển về múi giờ Việt Nam
            return now.Hour == 22 && now.Minute == 0;
        }
    }
} 