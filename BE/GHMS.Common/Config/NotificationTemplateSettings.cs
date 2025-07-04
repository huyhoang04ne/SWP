using System;

namespace GHMS.Common.Config
{
    public class NotificationTemplateSettings
    {
        // Đặt lịch thành công cho bệnh nhân
        public string BookingSuccessSubject { get; set; } = "Đặt lịch tư vấn thành công";
        public string BookingSuccessBody { get; set; } =
            "<h3>Xin chào {0},</h3><p>Bạn đã đặt lịch tư vấn thành công với tư vấn viên <b>{1}</b> vào lúc <b>{2:HH:mm dd/MM/yyyy}</b>.</p>";

        // Đặt lịch thành công cho tư vấn viên
        public string CounselorBookingSubject { get; set; } = "Bạn có lịch tư vấn mới";
        public string CounselorBookingBody { get; set; } =
            "<h3>Xin chào {0},</h3><p>Bạn vừa được đặt lịch tư vấn với bệnh nhân <b>{1}</b> vào lúc <b>{2:HH:mm dd/MM/yyyy}</b>.</p>";

        // Huỷ lịch cho bệnh nhân
        public string CancelBookingPatientSubject { get; set; } = "Lịch tư vấn đã bị huỷ";
        public string CancelBookingPatientBody { get; set; } =
            "<h3>Xin chào {0},</h3><p>Lịch tư vấn với tư vấn viên <b>{1}</b> vào lúc <b>{2:HH:mm dd/MM/yyyy}</b> đã bị huỷ.<br>Lý do: {3}</p>";

        // Huỷ lịch cho tư vấn viên
        public string CancelBookingCounselorSubject { get; set; } = "Lịch tư vấn đã bị huỷ";
        public string CancelBookingCounselorBody { get; set; } =
            "<h3>Xin chào {0},</h3><p>Lịch tư vấn với bệnh nhân <b>{1}</b> vào lúc <b>{2:HH:mm dd/MM/yyyy}</b> đã bị huỷ.<br>Lý do: {3}</p>";

        // Xác nhận lịch tư vấn (nếu có)
        public string ConfirmBookingSubject { get; set; } = "Lịch tư vấn đã được xác nhận";
        public string ConfirmBookingBody { get; set; } =
            "<h3>Xin chào {0},</h3><p>Lịch tư vấn với {1} vào lúc <b>{2:HH:mm dd/MM/yyyy}</b> đã được xác nhận.</p>";
    }
}