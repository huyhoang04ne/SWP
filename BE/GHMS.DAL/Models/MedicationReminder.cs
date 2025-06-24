using System;

namespace GHMS.DAL.Models
{
    public class MedicationReminder
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string? UserId { get; set; } // Cho phép null, vì có thể được gán sau
        public DateTime ReminderTime { get; set; } // Thời điểm cụ thể (ngày + giờ)
        public string? MedicationName { get; set; } // Cho phép null, gán sau
        public bool IsTaken { get; set; } = false; // Giá trị mặc định
        public int PillCount { get; set; } // Số viên thuốc
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public AppUser? User { get; set; } // Cho phép null, navigation property

        public DateTime? LastEmailSentDate { get; set; } // Ghi lại ngày cuối cùng đã gửi email
    }
}