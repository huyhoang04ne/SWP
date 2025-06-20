using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GHMS.Common.Req
{
    public class MedicationReminderCreateReq
    {
        [Required(ErrorMessage = "ReminderTime is required")]
        public TimeSpan ReminderTime { get; set; } // Giờ nhắc trong ngày (e.g., 08:00)

        [Required(ErrorMessage = "PillType is required")]
        [Range(21, 28, ErrorMessage = "PillType must be either 21 or 28")]
        public int PillType { get; set; } // Loại vỉ (21 hoặc 28 viên)

        public string MedicationName { get; set; } = "Birth Control Pill"; // Tên thuốc, mặc định
    }
}
