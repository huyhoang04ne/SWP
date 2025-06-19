using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GHMS.Common.Config
{
    public class MailTemplateSettings
    {
        public string ConfirmationSubject { get; set; } = "Xác nhận tài khoản";
        public string ConfirmationBody { get; set; } = "<h3>Vui lòng xác nhận đăng ký:</h3><p><a href='{0}'>Nhấn vào đây</a></p>";
    }
}