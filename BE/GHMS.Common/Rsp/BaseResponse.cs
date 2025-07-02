using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GHMS.Common.Rsp
{
    public class BaseResponse
    {
        public bool Success { get; set; }
        public string? Message { get; set; }
        public object? Data { get; set; }

        public static BaseResponse Ok(object? data = null, string? message = null)
        {
            return new BaseResponse { Success = true, Data = data, Message = message };
        }

        public static BaseResponse Fail(string message)
        {
            return new BaseResponse { Success = false, Message = message };
        }
    }
}
