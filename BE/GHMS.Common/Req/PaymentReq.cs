using System;

namespace GHMS.Common.Req
{
    public class PaymentReq
    {
        public int ConsultationId { get; set; }
        public decimal Amount { get; set; }
        public string PaymentType { get; set; } = "MOMO";
        public string? ReturnUrl { get; set; }
        public string? NotifyUrl { get; set; }
    }
} 