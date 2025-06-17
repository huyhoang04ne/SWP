using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GHMS.Common.DAL;
using GHMS.DAL.Models;

namespace GHMS.DAL.Repositories
{
    public class MenstrualCycleRep : GenericRep<MenstrualCycle>
    {
        public MenstrualCycleRep(GenderHealthContext context) : base(context) { }

        // Custom DB queries for cycles
        /// <summary>
        /// Get all cycles for a given user
        /// </summary>
        public IQueryable<MenstrualCycle> GetCyclesByUser(string userId)
            => _dbSet.Where(c => c.UserId == userId);

        /// <summary>
        /// Get next ovulation date calculated for the latest cycle
        /// </summary>
        public DateTime? GetNextOvulation(string userId)
        {
            var latest = _dbSet
                .Where(c => c.UserId == userId)
                .OrderByDescending(c => c.CycleStartDate)
                .FirstOrDefault();

            if (latest == null)
                return null;

            // Ovulation = start + (avgLength - 14)
            return latest.CycleStartDate.AddDays(latest.AverageLength - 14);
        }
    }// Custom DB queries for cycles can go here
}
