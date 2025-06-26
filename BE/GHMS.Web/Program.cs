using GHMS.BLL.Jobs;
using GHMS.BLL.Services;
using GHMS.Common.Config;
using GHMS.DAL.Data;
using GHMS.DAL.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Hangfire;
using Hangfire.SqlServer;

var builder = WebApplication.CreateBuilder(args);

// 📦 1. Add DbContext
builder.Services.AddDbContext<GHMSContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"),
        b => b.MigrationsAssembly("GHMS.DAL")));

// 📧 2. Cấu hình Smtp, JWT, Google, Template
builder.Services.Configure<SmtpSettings>(builder.Configuration.GetSection("Smtp"));
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("Jwt"));
builder.Services.Configure<GoogleAuthSettings>(builder.Configuration.GetSection("GoogleAuth"));
builder.Services.Configure<MailTemplateSettings>(builder.Configuration.GetSection("MailTemplate"));

// 🔐 3. Identity
builder.Services.AddIdentity<AppUser, IdentityRole>(options =>
{
    options.SignIn.RequireConfirmedEmail = true;
})
.AddEntityFrameworkStores<GHMSContext>()
.AddDefaultTokenProviders();

// 🧠 4. Service DI
builder.Services.AddScoped<AuthSvc>();
builder.Services.AddScoped<EmailService>();
builder.Services.AddScoped<MenstrualCycleService>();
builder.Services.AddScoped<MedicationReminderService>();
builder.Services.AddHostedService<DeleteUnverifiedUsersJob>();

// 🌐 5. Controller + Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "GHMS API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Description = "Please fill your JWT token: Bearer {your token}",
        Name = "Authorization",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

// 🔐 6. JWT Auth
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    var key = Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!);
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(key)
    };
});

// 🔓 7. CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// 🔁 8. Hangfire setup (đặt ở đây cùng AddDbContext, AddScoped,...)
builder.Services.AddHangfire(config =>
    config.UseSqlServerStorage(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddHangfireServer();

var app = builder.Build();

// 🚦 9. Middleware
app.UseCors("AllowAll");
app.UseSwagger();
app.UseSwaggerUI();

app.UseHangfireDashboard("/hangfire"); // Truy cập: http://localhost:{port}/hangfire

// 🕘 10. Đăng ký job định kỳ nhắc nhở thuốc
RecurringJob.AddOrUpdate<MedicationReminderService>(
    "daily-pill-reminder",
    svc => svc.SendDailyReminders(), // 🟡 Bạn cần định nghĩa hàm SendDailyReminders() trong MedicationReminderService
    Cron.Daily(9),
    TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time") // Giờ Việt Nam
);

//app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
