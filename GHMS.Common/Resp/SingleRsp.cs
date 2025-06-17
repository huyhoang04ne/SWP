using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GHMS.Common.Resp
{
    public class SingleRsp
    {
        public object Data { get; set; }  // Returned entity
        public string Error { get; set; } // Error message, if any
    }
}
