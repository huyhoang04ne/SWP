using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using GHMS.DAL.Models;
using GHMS.Common.Req;

namespace GHMS.DAL
{
    public class GenderHealthContext : DbContext
    {
        public GenderHealthContext(DbContextOptions<GenderHealthContext> options)
            : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<MenstrualCycle> MenstrualCycles { get; set; }
        public DbSet<MedicationReminder> MedicationReminders { get; set; }
        public DbSet<MenstrualDay> MenstrualDays { get; set; } // ✅ Thêm mới

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ✅ Cấu hình MenstrualCycle
            modelBuilder.Entity<MenstrualCycle>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.UserId).IsRequired().HasMaxLength(450);
                entity.HasIndex(e => e.UserId);
                entity.Property(e => e.CycleStartDate).IsRequired();
                entity.Property(e => e.AverageLength).IsRequired();
                entity.Property(e => e.Symptoms).HasMaxLength(1000);
                entity.Property(e => e.Notes).HasMaxLength(1000);
                entity.Property(e => e.OvulationDate);
                entity.Property(e => e.FertilityWindowStart);
                entity.Property(e => e.FertilityWindowEnd);
                entity.Property(e => e.CreatedAt).IsRequired();
                entity.Property(e => e.UpdatedAt);

                // 🔁 1 MenstrualCycle có nhiều MenstrualDays
                entity.HasMany(c => c.DailyRecords)
                      .WithOne(d => d.MenstrualCycle)
                      .HasForeignKey(d => d.MenstrualCycleId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // ✅ Cấu hình MedicationReminder
            modelBuilder.Entity<MedicationReminder>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.UserId).IsRequired().HasMaxLength(450);
                entity.HasIndex(e => e.UserId);
                entity.Property(e => e.ReminderTime).IsRequired();
                entity.Property(e => e.RegimenType).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Message).HasMaxLength(500);
                entity.Property(e => e.IsActive).IsRequired();
                entity.Property(e => e.CreatedAt).IsRequired();
                entity.Property(e => e.UpdatedAt);
            });

            // ✅ Cấu hình MenstrualDay
            modelBuilder.Entity<MenstrualDay>(entity =>
            {
                entity.HasKey(d => d.Id);
                entity.Property(d => d.Date).IsRequired();
                entity.Property(d => d.Symptoms).HasMaxLength(1000);
                entity.Property(d => d.Notes).HasMaxLength(1000);
                entity.Property(d => d.CreatedAt).IsRequired();
                entity.Property(d => d.UpdatedAt);

                // FK đến MenstrualCycle
                entity.HasOne(d => d.MenstrualCycle)
                      .WithMany(c => c.DailyRecords)
                      .HasForeignKey(d => d.MenstrualCycleId)
                      .OnDelete(DeleteBehavior.Cascade);

                // FK đến User
                entity.Property(d => d.UserId).IsRequired().HasMaxLength(450);
                entity.HasIndex(d => d.UserId);
            });
        }

        public override int SaveChanges()
        {
            ApplyAuditInformation();
            return base.SaveChanges();
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            ApplyAuditInformation();
            return base.SaveChangesAsync(cancellationToken);
        }

        private void ApplyAuditInformation()
        {
            var entries = ChangeTracker.Entries()
                .Where(e => e.Entity is MenstrualCycle || e.Entity is MedicationReminder || e.Entity is MenstrualDay)
                .ToList();

            var utcNow = DateTime.UtcNow;

            foreach (var entry in entries)
            {
                if (entry.State == EntityState.Added)
                {
                    ((dynamic)entry.Entity).CreatedAt = utcNow;
                }
                else if (entry.State == EntityState.Modified)
                {
                    ((dynamic)entry.Entity).UpdatedAt = utcNow;
                }
            }
        }
    }
}
