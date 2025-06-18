using GHMS.BLL.Svc;
using GHMS.Common.DAL;
using GHMS.Common.Req; // ✅ Đã thêm để dùng RegimenType
using GHMS.DAL;
using GHMS.DAL.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace GHMS.BLL.Services
{
    public class PillReminderService : IPillReminderService
    {
        private readonly IGenericRep<MedicationReminder> _remRep;
        private readonly IGenericRep<MenstrualCycle> _cycleRep;
        private readonly INotificationSender _notificationSender;

        public PillReminderService(
            IGenericRep<MedicationReminder> remRep,
            IGenericRep<MenstrualCycle> cycleRep,
            INotificationSender notificationSender)
        {
            _remRep = remRep;
            _cycleRep = cycleRep;
            _notificationSender = notificationSender;
        }

        public async Task ProcessReminderAsync(int reminderId)
        {
            var reminder = await _remRep.All
                .FirstOrDefaultAsync(r => r.Id == reminderId && r.IsActive);
            if (reminder == null) return;

            var nowUtc = DateTime.UtcNow;
            var today = nowUtc.Date;
            var currentTime = nowUtc.TimeOfDay;
            if (currentTime.Hours != reminder.ReminderTime.Hours ||
                currentTime.Minutes != reminder.ReminderTime.Minutes)
                return;

            var latestCycle = await _cycleRep.All
                .Where(c => c.UserId == reminder.UserId)
                .OrderByDescending(c => c.CycleStartDate)
                .FirstOrDefaultAsync();
            if (latestCycle == null) return;

            var cycleStart = latestCycle.CycleStartDate.Date;
            var daysSinceCycleStart = (today - cycleStart).Days;
            if (daysSinceCycleStart < 0) return;

            bool shouldSend = false;
            string sendMessage = null;
            switch (reminder.RegimenType)
            {
                case RegimenType.Pack21Days:
                    if (daysSinceCycleStart < 21)
                    {
                        shouldSend = true;
                        sendMessage = $"Hôm nay là ngày {daysSinceCycleStart + 1} của gói 21 ngày, hãy uống thuốc {reminder.MedicationName}.";
                    }
                    else if (daysSinceCycleStart == 21)
                    {
                        shouldSend = true;
                        sendMessage = "Gói thuốc 21 ngày đã kết thúc. Bắt đầu giai đoạn nghỉ 7 ngày, không cần uống thuốc. Hệ thống sẽ nhắc khi có chu kỳ tiếp theo.";
                    }
                    break;

                case RegimenType.Pack28Days:
                    if (daysSinceCycleStart < 21)
                    {
                        shouldSend = true;
                        sendMessage = $"Hôm nay là ngày {daysSinceCycleStart + 1} của gói 28 ngày, hãy uống thuốc {reminder.MedicationName} (active).";
                    }
                    else if (daysSinceCycleStart < 28)
                    {
                        shouldSend = true;
                        sendMessage = $"Hôm nay là ngày {daysSinceCycleStart + 1} của gói 28 ngày, hãy uống viên giả dược nếu theo hướng dẫn.";
                    }
                    else if (daysSinceCycleStart == 28)
                    {
                        shouldSend = true;
                        sendMessage = "Gói thuốc 28 ngày đã hoàn thành. Hệ thống sẽ nhắc khi bắt đầu chu kỳ tiếp theo.";
                    }
                    break;
            }

            if (shouldSend && sendMessage != null)
            {
                await _notificationSender.SendAsync(reminder.UserId, sendMessage);
            }
        }

        public async Task ProcessAllRemindersAtTimeAsync(TimeSpan time)
        {
            var today = DateTime.UtcNow.Date;
            var rems = await _remRep.All
                .Where(r => r.IsActive && r.ReminderTime.Hours == time.Hours && r.ReminderTime.Minutes == time.Minutes)
                .ToListAsync();

            foreach (var reminder in rems)
            {
                var latestCycle = await _cycleRep.All
                    .Where(c => c.UserId == reminder.UserId)
                    .OrderByDescending(c => c.CycleStartDate)
                    .FirstOrDefaultAsync();
                if (latestCycle == null) continue;

                var cycleStart = latestCycle.CycleStartDate.Date;
                var daysSinceCycleStart = (today - cycleStart).Days;
                if (daysSinceCycleStart < 0) continue;

                bool shouldSend = false;
                string sendMessage = null;

                switch (reminder.RegimenType)
                {
                    case RegimenType.Pack21Days:
                        if (daysSinceCycleStart < 21)
                        {
                            shouldSend = true;
                            sendMessage = $"Hôm nay là ngày {daysSinceCycleStart + 1} của gói 21 ngày, hãy uống thuốc {reminder.MedicationName}.";
                        }
                        else if (daysSinceCycleStart == 21)
                        {
                            shouldSend = true;
                            sendMessage = "Gói thuốc 21 ngày đã kết thúc. Bắt đầu giai đoạn nghỉ 7 ngày, không cần uống thuốc. Hệ thống sẽ nhắc khi có chu kỳ tiếp theo.";
                        }
                        break;

                    case RegimenType.Pack28Days:
                        if (daysSinceCycleStart < 21)
                        {
                            shouldSend = true;
                            sendMessage = $"Hôm nay là ngày {daysSinceCycleStart + 1} của gói 28 ngày, hãy uống thuốc {reminder.MedicationName} (active).";
                        }
                        else if (daysSinceCycleStart < 28)
                        {
                            shouldSend = true;
                            sendMessage = $"Hôm nay là ngày {daysSinceCycleStart + 1} của gói 28 ngày, hãy uống viên giả dược nếu theo hướng dẫn.";
                        }
                        else if (daysSinceCycleStart == 28)
                        {
                            shouldSend = true;
                            sendMessage = "Gói thuốc 28 ngày đã hoàn thành. Hệ thống sẽ nhắc khi bắt đầu chu kỳ tiếp theo.";
                        }
                        break;
                }

                if (shouldSend && sendMessage != null)
                {
                    await _notificationSender.SendAsync(reminder.UserId, sendMessage);
                }
            }
        }
    }
}
