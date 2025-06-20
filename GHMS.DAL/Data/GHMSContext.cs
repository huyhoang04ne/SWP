using GHMS.DAL.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.IO;
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
        public GHMSContext() { }
        public DbSet<MenstrualCycle> MenstrualCycles { get; set; }
        public DbSet<MenstrualPeriodDay> MenstrualPeriodDays { get; set; }
        public DbSet<MedicationReminder> MedicationReminders { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Cấu hình khóa chính cho MenstrualCycle
            modelBuilder.Entity<MenstrualCycle>(entity =>
            {
                entity.HasKey(e => e.Id);
            });

            // Cấu hình mối quan hệ giữa MenstrualPeriodDay và MenstrualCycle
            modelBuilder.Entity<MenstrualPeriodDay>(entity =>
            {
                entity.HasKey(e => e.Id);

                // Đảm bảo CycleId là kiểu int
                entity.Property(e => e.CycleId).IsRequired();

                // Thiết lập mối quan hệ 1-nhiều
                entity.HasOne(e => e.MenstrualCycle)
                      .WithMany(c => c.PeriodDays)
                      .HasForeignKey(e => e.CycleId)
                      .OnDelete(DeleteBehavior.Cascade);
            });
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                var config = new ConfigurationBuilder()
                    .SetBasePath(Directory.GetCurrentDirectory()) // <- dùng thư mục đang chạy
                    .AddJsonFile("appsettings.json")
                    .Build();

                var connectionString = config.GetConnectionString("DefaultConnection");

                optionsBuilder.UseSqlServer(connectionString);
            }
        }
    }
}
