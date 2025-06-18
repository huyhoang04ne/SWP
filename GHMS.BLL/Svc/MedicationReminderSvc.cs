using GHMS.Common.BLL;
using GHMS.Common.Req;
using GHMS.Common.Resp;
using GHMS.DAL.Models;
using GHMS.DAL.Repositories;
using System;

namespace GHMS.BLL.Svc
{
    public class MedicationReminderSvc : GenericSvc<MedicationReminderRep, MedicationReminder>
    {
        public MedicationReminderSvc(MedicationReminderRep rep) : base(rep) { }

        // Hàm tính thời gian nhắc tiếp theo
        public DateTime? Next(int id)
        {
            var res = Get(id);
            var mr = res.Data as MedicationReminder;
            if (mr == null || !mr.IsActive) return null;

            var now = DateTime.Now;
            var today = now.Date.Add(mr.ReminderTime);
            if (today > now) return today;

            return mr.RegimenType switch
            {
                RegimenType.Pack21Days => today.AddDays(1),
                RegimenType.Pack28Days => today.AddDays(1),
                _ => null
            };
        }
    }
}
