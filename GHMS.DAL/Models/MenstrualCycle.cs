using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GHMS.DAL.Models
{
    public class MenstrualCycle
    {
        public int Id { get; set; }
        public string UserId { get; set; }               // FK to Users
        public DateTime CycleStartDate { get; set; }     // Start of period
        public int AverageLength { get; set; }           // Avg cycle length
        public string Symptoms { get; set; }             // User symptoms
        public DateTime? OvulationDate { get; set; }
        public DateTime? FertilityWindowStart { get; set; }
        public DateTime? FertilityWindowEnd { get; set; }
        public string Notes { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
