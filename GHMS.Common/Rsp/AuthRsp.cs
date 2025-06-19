using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GHMS.Common.Rsp
{
    public class AuthRsp
    {
        public bool Success { get; set; }
        public string Message { get; set; } = default!;
        public string? Token { get; set; }
    }
}
