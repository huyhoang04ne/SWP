using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GHMS.BLL.Svc
{
    public interface IPillReminderService
    {
        /// <summary>
        /// Xử lý reminder cho một MedicationReminder cụ thể, gọi vào đúng giờ đã định.
        /// </summary>
        /// <param name="reminderId">ID của MedicationReminder</param>
        Task ProcessReminderAsync(int reminderId);

        /// <summary>
        /// Xử lý tất cả reminders có ReminderTime khớp với thời điểm được truyền (chạy hàng phút, v.v.).
        /// </summary>
        /// <param name="time">Thời điểm (TimeSpan) hiện tại, ví dụ giờ và phút</param>
        Task ProcessAllRemindersAtTimeAsync(TimeSpan time);
    }
}
