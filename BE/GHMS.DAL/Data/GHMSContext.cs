using GHMS.DAL.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace GHMS.DAL.Data
{
    public class GHMSContext : IdentityDbContext<AppUser>
    {
        public GHMSContext(DbContextOptions<GHMSContext> options) : base(options) { }
        public GHMSContext() { }

        public DbSet<ConsultationSchedule> ConsultationSchedules { get; set; }
        public DbSet<WorkingSchedule> WorkingSchedules { get; set; } // ✅ Thêm mới
        public DbSet<MenstrualCycle> MenstrualCycles { get; set; }
        public DbSet<MenstrualPeriodDay> MenstrualPeriodDays { get; set; }
        public DbSet<MedicationReminder> MedicationReminders { get; set; }
        public DbSet<MedicationSchedule> MedicationSchedules { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<RescheduleProposal> RescheduleProposals { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ✅ MenstrualCycle
            modelBuilder.Entity<MenstrualCycle>(entity =>
            {
                entity.HasKey(e => e.Id);
            });

            // ✅ MenstrualPeriodDay ↔ MenstrualCycle
            modelBuilder.Entity<MenstrualPeriodDay>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.CycleId).IsRequired();

                entity.HasOne(e => e.MenstrualCycle)
                      .WithMany(c => c.PeriodDays)
                      .HasForeignKey(e => e.CycleId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // ✅ MedicationSchedule ↔ AppUser
            modelBuilder.Entity<MedicationSchedule>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.UserId).IsRequired();

                entity.HasOne(e => e.User)
                      .WithMany()
                      .HasForeignKey(e => e.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // ✅ MedicationReminder ↔ MedicationSchedule
            modelBuilder.Entity<MedicationReminder>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.ScheduleId).IsRequired();

                entity.HasOne(e => e.Schedule)
                      .WithMany(s => s.Reminders)
                      .HasForeignKey(e => e.ScheduleId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // ✅ ConsultationSchedule ↔ Patient & Counselor
            modelBuilder.Entity<ConsultationSchedule>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.HasOne(e => e.Patient)
                      .WithMany()
                      .HasForeignKey(e => e.PatientId)
                      .OnDelete(DeleteBehavior.Restrict); // tránh xoá lan

                entity.HasOne(e => e.Counselor)
                      .WithMany()
                      .HasForeignKey(e => e.CounselorId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // ✅ WorkingSchedule ↔ Counselor
            modelBuilder.Entity<WorkingSchedule>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.CounselorId).IsRequired();

                entity.HasOne(e => e.Counselor)
                      .WithMany()
                      .HasForeignKey(e => e.CounselorId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // Cấu hình 1-n: RescheduleProposal - ProposedSlots
            modelBuilder.Entity<RescheduleProposal>()
                .HasMany(rp => rp.ProposedSlots)
                .WithOne(ps => ps.RescheduleProposal)
                .HasForeignKey(ps => ps.RescheduleProposalId)
                .OnDelete(DeleteBehavior.Cascade);

            // Cấu hình 1-1: RescheduleProposal - SelectedSlot
            modelBuilder.Entity<RescheduleProposal>()
                .HasOne(rp => rp.SelectedSlot)
                .WithMany()
                .HasForeignKey(rp => rp.SelectedSlotId)
                .OnDelete(DeleteBehavior.Restrict);
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                var config = new ConfigurationBuilder()
                    .SetBasePath(Directory.GetCurrentDirectory())
                    .AddJsonFile("appsettings.json")
                    .Build();

                var connectionString = config.GetConnectionString("DefaultConnection");

                optionsBuilder.UseSqlServer(connectionString);
            }
        }
    }
}
