using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GHMS.Common.BLL;
using GHMS.Common.Resp;
using GHMS.DAL.Models;
using GHMS.DAL.Repositories;
using System;

namespace GHMS.BLL.Svc
{
    public class MedicationReminderSvc : GenericSvc<MedicationReminder>
    {
        private readonly MedicationReminderRep _rep;
        public MedicationReminderSvc(MedicationReminderRep rep) : base(rep)
        {
            _rep = rep;
        }

        // Determine next reminder datetime
        public DateTime? Next(int id)
        {
            var res = Get(id);
            var mr = res.Data as MedicationReminder;
            if (mr == null || !mr.IsActive) return null;

            var now = DateTime.Now;
            var today = now.Date.Add(mr.ReminderTime);
            if (today > now) return today;

            return mr.Frequency.ToLower() == "daily" ? today.AddDays(1) : today.AddDays(7);
        }
    }
}
