using GHMS.BLL.Jobs;
using GHMS.BLL.Services;
using GHMS.Common.Config;
using GHMS.Common.Interfaces;
using GHMS.DAL.Data;
using GHMS.DAL.Models;
using Hangfire;
using Hangfire.SqlServer;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// 📦 1. Add DbContext
builder.Services.AddDbContext<GHMSContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"),
        b => b.MigrationsAssembly("GHMS.DAL"))
        .LogTo(Console.WriteLine, LogLevel.Information) // 👈 log truy vấn SQL
);

// 📧 2. Cấu hình AppSettings
builder.Services.Configure<SmtpSettings>(builder.Configuration.GetSection("Smtp"));
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("Jwt"));
builder.Services.Configure<GoogleAuthSettings>(builder.Configuration.GetSection("GoogleAuth"));
builder.Services.Configure<MailTemplateSettings>(builder.Configuration.GetSection("MailTemplate"));

// 🔐 3. Identity
builder.Services.AddIdentity<AppUser, IdentityRole>(options =>
{
    options.SignIn.RequireConfirmedEmail = true;
})
.AddEntityFrameworkStores<GHMSContext>() // ⬅ Đây phải khớp với DbContext của bạn
.AddDefaultTokenProviders();

// 🧠 4. DI Services
builder.Services.AddScoped<AuthSvc>();
builder.Services.AddScoped<EmailService>();
builder.Services.AddScoped<MenstrualCycleService>();
builder.Services.AddScoped<MedicationReminderService>();
builder.Services.AddHostedService<DeleteUnverifiedUsersJob>();
builder.Services.AddScoped<IEmailService, EmailService>();

// 🔁 5. Hangfire setup
builder.Services.AddHangfire(config =>
    config.UseSqlServerStorage(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddHangfireServer();

// 🔐 6. JWT Authentication
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

builder.Services.AddAuthorization();
builder.Services.AddControllers();

// 🌐 7. CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// 📘 8. Swagger + JWT Bearer Support
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "GHMS API", Version = "v1" });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Nhập token dạng: Bearer {token}"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

// 🧭 9. App Pipeline
var app = builder.Build();

app.UseCors("AllowAll");

app.UseSwagger();
app.UseSwaggerUI();

app.UseAuthentication();
app.UseAuthorization();

app.UseHangfireDashboard("/hangfire"); // http://localhost:{port}/hangfire

// Chạy mỗi phút
RecurringJob.AddOrUpdate<MedicationReminderService>(
    "check-pill-reminder-every-minute",
    svc => svc.SendDailyReminders(),
    Cron.Minutely(), // 👈 chạy mỗi phút
    TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time") // giờ Việt Nam
);

//app.UseHttpsRedirection();
app.MapControllers();

app.Run();
