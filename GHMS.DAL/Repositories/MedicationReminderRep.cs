using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GHMS.Common.DAL;
using GHMS.DAL.Models;

namespace GHMS.DAL.Repositories
{
    public class MedicationReminderRep : GenericRep<MedicationReminder>
    {
        public MedicationReminderRep(GenderHealthContext context) : base(context) { }

        // Custom DB queries for reminders
        /// <summary>
        /// Get all active reminders for a given user
        /// </summary>
        public IQueryable<MedicationReminder> GetActiveByUser(string userId)
            => _dbSet.Where(r => r.UserId == userId && r.IsActive);

        /// <summary>
        /// Get reminders scheduled at or before a specific datetime
        /// </summary>
        public IQueryable<MedicationReminder> GetDueReminders(DateTime asOf)
        {
            var timeOfDay = asOf.TimeOfDay;
            return _dbSet
                .Where(r => r.IsActive && r.ReminderTime <= timeOfDay);
        }
    }
}

