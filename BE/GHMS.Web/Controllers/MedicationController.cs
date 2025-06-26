using GHMS.BLL.Services;
using GHMS.Common.Req;
using GHMS.DAL.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace GHMS.Web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class MedicationController : ControllerBase
    {
        private readonly MedicationReminderService _service;
        private readonly UserManager<AppUser> _userManager;

        public MedicationController(MedicationReminderService service, UserManager<AppUser> userManager)
        {
            _service = service;
            _userManager = userManager;
        }

        [HttpPost("set-schedule")]
        public async Task<IActionResult> SetSchedule([FromBody] SetScheduleReq req)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { message = "User not authenticated." });

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return NotFound(new { message = "Người dùng không tồn tại." });

            await _service.SetOrUpdateScheduleAsync(req, userId);
            return Ok(new { message = "Lịch uống thuốc đã được thiết lập." });
        }

        [HttpGet("upcoming-reminders")]
        public async Task<IActionResult> GetUpcomingReminders()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var reminders = await _service.GetUpcomingRemindersAsync(userId);
            return Ok(reminders.Select(r => new
            {
                r.ReminderTime,
                r.IsTaken
            }));
        }
    }
}
