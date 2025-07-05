using System;

namespace GHMS.Common.Config
{
    public class NotificationTemplateSettings
    {
        // Xác nhận lịch tư vấn
        public string ConfirmBookingSubject { get; set; } = "Lịch tư vấn đã được xác nhận";
        public string ConfirmBookingBody { get; set; } =
            "<h3>Xin chào {0},</h3><p>Lịch tư vấn với tư vấn viên <b>{1}</b> vào lúc <b>{2:HH:mm dd/MM/yyyy}</b> đã được xác nhận.</p>";

        // Đặt lịch tư vấn đang chờ xác nhận
        public string BookingPendingSubject { get; set; } = "Đặt lịch tư vấn đang chờ xác nhận";
        public string BookingPendingBody { get; set; } =
            "<h3>Xin chào {0},</h3><p>Bạn đã đặt lịch tư vấn với tư vấn viên <b>{1}</b> vào lúc <b>{2:HH:mm dd/MM/yyyy}</b>.<br>Vui lòng chờ tư vấn viên xác nhận.</p>";

        // Huỷ lịch tư vấn
        public string CancelBookingSubject { get; set; } = "Lịch tư vấn đã bị huỷ";
        public string CancelBookingBody { get; set; } =
            "<h3>Xin chào {0},</h3><p>Lịch tư vấn với tư vấn viên <b>{1}</b> vào lúc <b>{2:HH:mm dd/MM/yyyy}</b> đã bị huỷ.<br>Lý do: {3}</p>";

        // Đề xuất đổi lịch tư vấn
        public string RescheduleBookingSubject { get; set; } = "Đề xuất đổi lịch tư vấn";
        public string RescheduleBookingBody { get; set; } =
            "<h3>Xin chào {0},</h3><p>Lịch tư vấn với tư vấn viên <b>{1}</b> vào lúc <b>{2:HH:mm dd/MM/yyyy}</b> đã bị huỷ.<br>Lý do: {3}</p><p>Tư vấn viên đề xuất lịch mới vào lúc <b>{4:HH:mm dd/MM/yyyy}</b>. Vui lòng xác nhận hoặc chọn lịch khác trên hệ thống.</p>";

        // Đề xuất đổi lịch tư vấn
        public string RescheduleProposalSubject { get; set; } = "Tư vấn viên đề xuất đổi lịch tư vấn";
        public string RescheduleProposalBody { get; set; } =
            "<h3>Xin chào {0},</h3><p>Lịch tư vấn với tư vấn viên <b>{1}</b> đã bị huỷ.<br>Lý do: {2}</p><p>Tư vấn viên đề xuất các khung giờ sau:<br>{3}</p><p>Vui lòng chọn một khung giờ phù hợp hoặc từ chối đề xuất này trên hệ thống.</p>";
    }
}