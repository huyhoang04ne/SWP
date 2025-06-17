using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using GHMS.DAL.Models;

namespace GHMS.DAL
{
    public class GenderHealthContext : DbContext
    {
        public GenderHealthContext(DbContextOptions<GenderHealthContext> options)
            : base(options) { }

        public DbSet<MenstrualCycle> MenstrualCycles { get; set; }
        public DbSet<MedicationReminder> MedicationReminders { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Add entity configurations if needed
            base.OnModelCreating(modelBuilder);
        }
    }
}
