using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GHMS.BLL.Svc
{
    public class ConsoleNotificationSender : INotificationSender
    {
        public Task SendAsync(string userId, string message)
        {
            Console.WriteLine($"[Gửi đến {userId}]: {message}");
            return Task.CompletedTask;
        }
    }
}