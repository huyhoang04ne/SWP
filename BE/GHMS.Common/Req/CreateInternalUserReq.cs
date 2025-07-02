using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GHMS.Common.Req
{
    namespace GHMS.Common.Req
    {
        public class CreateInternalUserReq
        {
            public string Email { get; set; } = string.Empty;
            public string FullName { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
            public string Role { get; set; } = string.Empty; // Chỉ: Staff, Counselor, Manager
        }
    }
}
