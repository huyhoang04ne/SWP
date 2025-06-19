using GHMS.BLL.Services;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace GHMS.BLL.Jobs
{
    public class DeleteUnverifiedUsersJob : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<DeleteUnverifiedUsersJob> _logger;

        public DeleteUnverifiedUsersJob(IServiceProvider serviceProvider, ILogger<DeleteUnverifiedUsersJob> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                using var scope = _serviceProvider.CreateScope();
                var authSvc = scope.ServiceProvider.GetRequiredService<AuthSvc>();

                try
                {
                    int deleted = await authSvc.DeleteUnverifiedUsersAsync();
                    if (deleted > 0)
                    {
                        _logger.LogInformation($"🧹 Đã xóa {deleted} người dùng chưa xác nhận lúc {DateTime.UtcNow}.");
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Lỗi khi xoá tài khoản chưa xác nhận.");
                }

                await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken); // kiểm tra mỗi phút
            }
        }
    }
}
