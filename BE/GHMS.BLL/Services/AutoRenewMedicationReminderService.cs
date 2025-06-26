using GHMS.Common.Req;
using GHMS.DAL.Data;
using Microsoft.EntityFrameworkCore;

namespace GHMS.BLL.Services
{
    public class AutoRenewMedicationReminderService
    {
        private readonly GHMSContext _context;
        private readonly MedicationReminderService _reminderService;

        public AutoRenewMedicationReminderService(GHMSContext context, MedicationReminderService reminderService)
        {
            _context = context;
            _reminderService = reminderService;
        }

        public async Task RenewAllSchedules()
        {
            var schedules = await _context.MedicationSchedules.ToListAsync();

            foreach (var schedule in schedules)
            {
                var userId = schedule.UserId;
                var req = new SetScheduleReq
                {
                    PillType = schedule.PillType,
                    ReminderHour = schedule.ReminderHour,
                    ReminderMinute = schedule.ReminderMinute
                };

                await _reminderService.SetOrUpdateScheduleAsync(req, userId);
            }
        }
    }
}
