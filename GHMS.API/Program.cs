// ✅ Hoàn chỉnh cấu hình DI để tránh lỗi thiếu phụ thuộc trong PillReminderService
using GHMS.BLL.Services;
using GHMS.BLL.Svc;
using GHMS.Common.BLL;
using GHMS.Common.DAL;
using GHMS.DAL;
using GHMS.DAL.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;



var builder = WebApplication.CreateBuilder(args);
// ✅ Fix for CS1061: Ensure the correct namespace is included for 'AddDatabaseDeveloperPageExceptionFilter'
// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// DbContext
builder.Services.AddDbContext<GenderHealthContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Generic DI
builder.Services.AddScoped(typeof(IGenericRep<>), typeof(GenericRep<>));
builder.Services.AddScoped<DbContext, GenderHealthContext>();
builder.Services.AddScoped<MenstrualDayRep>();
builder.Services.AddScoped<MenstrualDaySvc>();

// ✅ Repositories cụ thể
builder.Services.AddScoped<MedicationReminderRep>();
builder.Services.AddScoped<MenstrualCycleRep>();

// ✅ Services cụ thể
builder.Services.AddScoped<MedicationReminderSvc>();
builder.Services.AddScoped<MenstrualCycleSvc>();
builder.Services.AddScoped<IPillReminderService, PillReminderService>();

// ✅ Thêm NotificationSender (cần thiết để resolve cho PillReminderService)
builder.Services.AddScoped<INotificationSender, ConsoleNotificationSender>(); // Bạn cần tạo class này

var key = builder.Configuration["Jwt:Key"];
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.ASCII.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });

builder.Services.AddAuthorization();

// Add Authorization
builder.Services.AddAuthorization();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "GHMS API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Nhập vào token dạng: Bearer {token}"
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


var app = builder.Build();

// Middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapGet("/", async context =>
{
    context.Response.Redirect("/swagger");
});

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
