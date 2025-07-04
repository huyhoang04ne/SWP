using GHMS.DAL.Data;
using GHMS.DAL.Models;

namespace GHMS.BLL.Services
{
    public class NotificationService
    {
        private readonly GHMSContext _context;
        public NotificationService(GHMSContext context)
        {
            _context = context;
        }

        public async Task CreateNotificationAsync(string userId, string title, string content)
        {
            var notification = new Notification
            {
                UserId = userId,
                Title = title,
                Content = content
            };
            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();
        }

        public async Task<List<Notification>> GetNotificationsAsync(string userId)
        {
            return _context.Notifications
                .Where(n => n.UserId == userId)
                .OrderByDescending(n => n.CreatedAt)
                .ToList();
        }

        public async Task MarkAsReadAsync(int notificationId)
        {
            var notification = await _context.Notifications.FindAsync(notificationId);
            if (notification != null)
            {
                notification.IsRead = true;
                await _context.SaveChangesAsync();
            }
        }
    }
}
