using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GHMS.Common.Rsp
{
    public class SingleRsp
    {
        public object Data { get; set; }
        public string Message { get; set; }
        public bool Success => string.IsNullOrEmpty(Message);

        public void SetError(string message) => Message = message;
        public void SetMessage(string message) => Message = message;
    }
}
