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

        /// <summary>
        /// Get all menstrual cycles of a specific user
        /// </summary>
        /// <param name="userId">ID of the user</param>
        /// <returns>IQueryable of cycles</returns>
        public IQueryable<MenstrualCycle> GetCyclesByUser(string userId)
        {
            return _dbSet.Where(c => c.UserId == userId)
                         .OrderByDescending(c => c.CycleStartDate);
        }

        /// <summary>
        /// Get the most recent cycle of a user
        /// </summary>
        public MenstrualCycle? GetLatestCycle(string userId)
        {
            return _dbSet.Where(c => c.UserId == userId)
                         .OrderByDescending(c => c.CycleStartDate)
                         .FirstOrDefault();
        }

        /// <summary>
        /// Calculate next ovulation date based on latest cycle
        /// </summary>
        public DateTime? GetNextOvulation(string userId)
        {
            var latest = GetLatestCycle(userId);
            if (latest == null)
                return null;

            // Ovulation = start + (avgLength - 14)
            return latest.CycleStartDate.AddDays(latest.AverageLength - 14);
        }

        /// <summary>
        /// Estimate fertile window (start = ovulation - 5, end = ovulation + 1)
        /// </summary>
        public (DateTime? Start, DateTime? End) GetFertilityWindow(string userId)
        {
            var ovulationDate = GetNextOvulation(userId);
            if (ovulationDate == null)
                return (null, null);

            return (
                Start: ovulationDate.Value.AddDays(-5),
                End: ovulationDate.Value.AddDays(1)
            );
        }
    }
}
