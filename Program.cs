using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore;
using SWP391.Data;

var builder = WebApplication.CreateBuilder(args);

// Thêm dịch vụ MVC (Controllers + Views)
builder.Services.AddControllersWithViews();

builder.Services.AddHttpContextAccessor();


// Kích hoạt Session
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30); // thời gian session sống
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

// Cấu hình DbContext kết nối SQL Server
builder.Services.AddDbContext<GhmsDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("GHMSConnection")));

var app = builder.Build();

// Kích hoạt các middleware
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

// Kích hoạt Session
app.UseSession();

app.UseAuthorization();

// Cấu hình route mặc định
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Account}/{action=Login}/{id?}");

app.Run();
