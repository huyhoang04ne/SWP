using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GHMS.Common.Rsp
{
    public class FertileWindowRsp
    {
        public DateTime OvulationDate { get; set; }
        public DateTime FertileStart { get; set; }
        public DateTime FertileEnd { get; set; }
    }

}
