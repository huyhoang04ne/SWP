using GHMS.DAL.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;

namespace GHMS.DAL.Seed
{
    public static class DataSeeder
    {
        public static async Task SeedRolesAndAdminAsync(IServiceProvider services)
        {
            var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
            var userManager = services.GetRequiredService<UserManager<AppUser>>();

            // 1. Tạo các vai trò
            string[] roles = { "Admin", "Manager", "Staff", "Counselor", "Patient" };
            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                    await roleManager.CreateAsync(new IdentityRole(role));
            }

            // 2. Tạo admin nếu chưa có
            var adminEmail = "admin@ghms.com";
            var adminPassword = "Admin123@";

            var admin = await userManager.FindByEmailAsync(adminEmail);
            if (admin == null)
            {
                var newAdmin = new AppUser
                {
                    UserName = adminEmail,
                    Email = adminEmail,
                    EmailConfirmed = true,
                    FullName = "System Admin"
                };

                var result = await userManager.CreateAsync(newAdmin, adminPassword);
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(newAdmin, "Admin");
                    Console.WriteLine("✅ Admin account seeded.");
                }
            }
        }
    }
}
