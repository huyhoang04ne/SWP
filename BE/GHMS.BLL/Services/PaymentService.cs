using GHMS.Common.Req;
using GHMS.Common.Rsp;
using GHMS.DAL.Data;
using GHMS.DAL.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Net.Http;

namespace GHMS.BLL.Services
{
    public class PaymentService
    {
        private readonly GHMSContext _context;
        private readonly IConfiguration _config;
        public PaymentService(GHMSContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        public async Task<BaseResponse<PaymentRsp.PaymentData>> CreateMomoPaymentAsync(PaymentReq req)
        {
            // Lấy cấu hình MOMO
            var momoConfig = _config.GetSection("Momo");
            var endpoint = momoConfig["Endpoint"];
            var partnerCode = momoConfig["PartnerCode"];
            var accessKey = momoConfig["AccessKey"];
            var secretKey = momoConfig["SecretKey"];
            var returnUrl = momoConfig["ReturnUrl"];
            var notifyUrl = momoConfig["NotifyUrl"];

            var orderId = $"GHMS_{req.ConsultationId}_{DateTime.UtcNow.Ticks}";
            var requestId = Guid.NewGuid().ToString();
            var amount = ((int)req.Amount).ToString();

            // 1. Tạo raw data để ký số
            var rawData = $"accessKey={accessKey}&amount={amount}&extraData=&ipnUrl={notifyUrl}&orderId={orderId}&orderInfo=Thanh toan lich tu van&partnerCode={partnerCode}&redirectUrl={returnUrl}&requestId={requestId}&requestType=captureWallet";

            // 2. Ký số SHA256
            string signature;
            using (var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(secretKey)))
            {
                var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(rawData));
                signature = BitConverter.ToString(hash).Replace("-", "").ToLower();
            }

            // 3. Tạo payload JSON
            var payload = new
            {
                partnerCode,
                accessKey,
                requestId,
                amount,
                orderId,
                orderInfo = "Thanh toan lich tu van",
                redirectUrl = returnUrl,
                ipnUrl = notifyUrl,
                extraData = "",
                requestType = "captureWallet",
                signature
            };

            // 4. Gửi HTTP POST tới MOMO
            using var client = new HttpClient();
            var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
            var response = await client.PostAsync(endpoint, content);
            var responseBody = await response.Content.ReadAsStringAsync();

            // 5. Parse response
            var momoRes = JsonSerializer.Deserialize<MomoCreatePaymentResponse>(responseBody);

            // 6. Lưu Payment
            var payment = new Payment
            {
                OrderId = orderId,
                Amount = req.Amount,
                PaymentType = req.PaymentType,
                Status = "pending",
                CreatedAt = DateTime.UtcNow,
                PaymentUrl = momoRes?.payUrl,
                RawResponse = responseBody
            };
            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();

            // 7. Gán PaymentId vào ConsultationSchedule
            var consultation = await _context.ConsultationSchedules.FindAsync(req.ConsultationId);
            if (consultation != null)
            {
                consultation.PaymentId = payment.Id;
                await _context.SaveChangesAsync();
            }

            return BaseResponse<PaymentRsp.PaymentData>.Ok(new PaymentRsp.PaymentData
            {
                OrderId = orderId,
                PaymentUrl = momoRes?.payUrl,
                Status = payment.Status,
                Amount = payment.Amount
            }, "Khởi tạo giao dịch thành công");
        }

        // Không cần hàm tạo QR động, callback, refund tự động cho QR cố định
        // Nếu muốn tracking thủ công, có thể giữ lại hàm lấy danh sách Payment hoặc thêm hàm cho admin đối soát

        // Model response của MOMO
        public class MomoCreatePaymentResponse
        {
            public string? payUrl { get; set; }
            public string? deeplink { get; set; }
            public string? qrCodeUrl { get; set; }
            public int resultCode { get; set; }
            public string? message { get; set; }
        }

        public class MomoRefundResponse
        {
            public int resultCode { get; set; }
            public string? message { get; set; }
            public string? requestId { get; set; }
            public string? orderId { get; set; }
            public string? transId { get; set; }
        }
    }
} 