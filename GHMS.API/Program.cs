using GHMS.DAL;
using GHMS.Common.DAL;
using GHMS.Common.BLL;
using GHMS.BLL.Svc;
using GHMS.DAL.Repositories;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// DbContext
builder.Services.AddDbContext<GenderHealthContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Generic DI
builder.Services.AddScoped(typeof(IGenericRep<>), typeof(GenericRep<>));
builder.Services.AddScoped(typeof(IGenericSvc<>), typeof(GenericSvc<>));

// Specific Repos & Services
builder.Services.AddScoped<MenstrualCycleRep>();
builder.Services.AddScoped<MedicationReminderRep>();
builder.Services.AddScoped<MenstrualCycleSvc>();
builder.Services.AddScoped<MedicationReminderSvc>();

var app = builder.Build();

// Middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();
