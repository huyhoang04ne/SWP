using GHMS.DAL.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace GHMS.BLL.Services
{
    public class MedicationReminderBackgroundService : BackgroundService
    {
        private readonly IServiceScopeFactory _serviceScopeFactory;
        private readonly ILogger<MedicationReminderBackgroundService> _logger;

        public MedicationReminderBackgroundService(
            IServiceScopeFactory serviceScopeFactory,
            ILogger<MedicationReminderBackgroundService> logger)
        {
            _serviceScopeFactory = serviceScopeFactory;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("MedicationReminderBackgroundService started.");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using var scope = _serviceScopeFactory.CreateScope();
                    var reminderService = scope.ServiceProvider.GetRequiredService<MedicationReminderService>();
                    var context = scope.ServiceProvider.GetRequiredService<GHMSContext>();

                    var now = DateTime.UtcNow;
                    var today = now.Date;
                    var timeWindowEnd = now.AddMinutes(5); // Cửa sổ thời gian 5 phút để tránh bỏ sót

                    var reminders = await context.MedicationReminders
                        .Where(r => r.ReminderTime.Date == today
                                 && r.ReminderTime >= now
                                 && r.ReminderTime <= timeWindowEnd
                                 && !r.IsTaken)
                        .ToListAsync(stoppingToken);

                    foreach (var reminder in reminders)
                    {
                        try
                        {
                            await reminderService.SendReminderEmail(reminder);
                            reminder.IsTaken = true; // Đánh dấu đã gửi/gửi thành công
                            reminder.UpdatedAt = DateTime.UtcNow;
                        }
                        catch (Exception ex)
                        {
                            _logger.LogError(ex, "Failed to send reminder email for MedicationReminder {Id}", reminder.Id);
                        }
                    }

                    await context.SaveChangesAsync(stoppingToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error in MedicationReminderBackgroundService");
                }

                await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
            }

            _logger.LogInformation("MedicationReminderBackgroundService stopped.");
        }
    }
}