using GHMS.BLL.Services;
using GHMS.DAL.Data;
using GHMS.Common.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.IO;

public class NotifyUpcomingEventsJob
{
    private readonly GHMSContext _context;
    private readonly MenstrualCycleService _cycleService;
    private readonly IEmailService _emailService;

    public NotifyUpcomingEventsJob(GHMSContext context, MenstrualCycleService cycleService, IEmailService emailService)
    {
        _context = context;
        _cycleService = cycleService;
        _emailService = emailService;
    }

    public async Task RunAsync()
    {
        var patientRole = await _context.Roles.FirstOrDefaultAsync(r => r.Name == "Patient");
        var patientIds = await _context.UserRoles
            .Where(ur => ur.RoleId == patientRole.Id)
            .Select(ur => ur.UserId)
            .ToListAsync();

        var patients = await _context.Users
            .Where(u => patientIds.Contains(u.Id) && u.EmailConfirmed)
            .ToListAsync();

        foreach (var patient in patients)
        {
            var prediction = await _cycleService.GetFertileWindowAsync(patient.Id);
            if (prediction == null) continue;

            var today = DateTime.UtcNow.Date;
            // Ngày hành kinh tiếp theo
            var nextPeriod = prediction.StartDate.AddDays(prediction.CycleLength);
            // Gửi thông báo kỳ kinh nguyệt
            if ((nextPeriod - today).Days == 3)
            {
                string template = File.ReadAllText("BE/GHMS.BLL/Templates/PeriodReminderTemplate.html");
                template = template.Replace("{{PatientName}}", patient.UserName ?? "bạn")
                                   .Replace("{{PeriodStartDate}}", nextPeriod.ToString("dd/MM/yyyy"));
                await _emailService.SendEmailAsync(
                    patient.Email,
                    "⏰ Kỳ kinh nguyệt của bạn dự kiến sẽ bắt đầu vào ngày mai",
                    template
                );
            }

            // Ngày bắt đầu vùng màu mỡ
            if ((prediction.FertileStart - today).Days == 3)
            {
                string template = File.ReadAllText("BE/GHMS.BLL/Templates/FertileWindowTemplate.html");
                template = template.Replace("{{PatientName}}", patient.UserName ?? "bạn")
                                   .Replace("{{FertileStartDate}}", prediction.FertileStart.ToString("dd/MM/yyyy"))
                                   .Replace("{{FertileEndDate}}", prediction.FertileEnd.ToString("dd/MM/yyyy"));
                await _emailService.SendEmailAsync(
                    patient.Email,
                    "🌼 Hôm nay bạn bắt đầu bước vào vùng màu mỡ",
                    template
                );
            }
        }
    }
}
