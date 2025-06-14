using Microsoft.EntityFrameworkCore;
using SWP391.Models;
using System.Collections.Generic;

namespace SWP391.Data
{
    public class GhmsDbContext : DbContext
    {
        public GhmsDbContext(DbContextOptions<GhmsDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }

        // (Tùy chọn) Nếu muốn cấu hình bảng chi tiết hơn
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>().HasKey(u => u.Id);
            // Có thể thêm cấu hình các cột tại đây nếu cần
        }
    }
}
