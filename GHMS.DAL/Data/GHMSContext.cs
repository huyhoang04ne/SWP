using GHMS.DAL.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GHMS.DAL.Data
{
    public class GHMSContext : IdentityDbContext<AppUser>
    {
        public GHMSContext(DbContextOptions<GHMSContext> options) : base(options) { }

        public DbSet<MenstrualCycle> MenstrualCycles { get; set; }
        public DbSet<MenstrualPeriodDay> MenstrualPeriodDays { get; set; }
        public DbSet<MedicationReminder> MedicationReminders { get; set; }

    }
}