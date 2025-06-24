using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GHMS.Common.Config
{
    public class SmtpSettings
    {
        public string? Host { get; set; } // Cho phép null, mặc định từ config
        public int Port { get; set; } // Cần giá trị, nhưng sẽ được gán từ config
        public bool EnableSsl { get; set; } = true; // Giá trị mặc định
        public string? User { get; set; } // Cho phép null, gán từ config
        public string? Password { get; set; } // Cho phép null, gán từ config
    }
}