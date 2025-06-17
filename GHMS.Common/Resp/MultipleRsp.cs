using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GHMS.Common.Resp
{
    public class MultipleRsp
    {
        public object Data { get; set; }  // Collection of entities
        public string Error { get; set; } // Error message, if any
    }
}
