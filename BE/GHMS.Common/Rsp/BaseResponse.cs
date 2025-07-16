using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GHMS.Common.Rsp
{
    public class BaseResponse<T> // generic
    {
        public bool Success { get; set; }
        public string? Message { get; set; }
        public T? Data { get; set; }
        public int StatusCode { get; set; } = 200;
        public List<string>? Errors { get; set; }

        public static BaseResponse<T> Ok(T? data = default, string? message = null, int statusCode = 200)
        {
            return new BaseResponse<T> { Success = true, Data = data, Message = message, StatusCode = statusCode };
        }

        public static BaseResponse<T> Fail(string message, int statusCode = 400, List<string>? errors = null)
        {
            return new BaseResponse<T> { Success = false, Message = message, StatusCode = statusCode, Errors = errors };
        }
    }

    // Backward compatibility
    public class BaseResponse : BaseResponse<object?>
    {
        public new static BaseResponse Ok(object? data = null, string? message = null, int statusCode = 200)
        {
            return new BaseResponse { Success = true, Data = data, Message = message, StatusCode = statusCode };
        }
        public new static BaseResponse Fail(string message, int statusCode = 400, List<string>? errors = null)
        {
            return new BaseResponse { Success = false, Message = message, StatusCode = statusCode, Errors = errors };
        }
    }

    public class PaymentRsp : BaseResponse<PaymentRsp.PaymentData>
    {
        public class PaymentData
        {
            public string OrderId { get; set; } = string.Empty;
            public string? PaymentUrl { get; set; }
            public string? TransactionId { get; set; }
            public string Status { get; set; } = "pending";
            public decimal Amount { get; set; }
            public string? QrCodeUrl { get; set; } // Thêm trường này
        }
    }
}
