using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GHMS.BLL.Svc
{
    public interface INotificationSender
    {
        /// <summary>
        /// Gửi thông báo nhắc nhở đến người dùng.
        /// </summary>
        /// <param name="userId">ID người dùng</param>
        /// <param name="message">Nội dung thông báo</param>
        Task SendAsync(string userId, string message);
    }
}
