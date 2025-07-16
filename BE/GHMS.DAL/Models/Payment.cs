using System;
using System.ComponentModel.DataAnnotations;

namespace GHMS.DAL.Models
{
    public class Payment
    {
        [Key]
        public int Id { get; set; }
        public string OrderId { get; set; } = string.Empty; // Mã đơn hàng MOMO
        public string? TransactionId { get; set; } // Mã giao dịch trả về từ MOMO
        public string? PaymentUrl { get; set; } // Link thanh toán trả về cho FE
        public string? PaymentType { get; set; } // MOMO, Stripe, ...
        public decimal Amount { get; set; }
        public string Status { get; set; } = "pending"; // pending, paid, refunded, failed
        public string? RawResponse { get; set; } // Lưu JSON MOMO trả về
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? PaidAt { get; set; }
        public DateTime? RefundedAt { get; set; }
    }
} 