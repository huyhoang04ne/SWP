using GHMS.BLL.Services;
using GHMS.Common.Req;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;

namespace GHMS.Web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class MedicationController : ControllerBase
    {
        private readonly MedicationReminderService _reminderService;

        public MedicationController(MedicationReminderService reminderService)
        {
            _reminderService = reminderService;
        }

        [HttpPost("set-reminder")]
        public async Task<IActionResult> SetReminder([FromBody] MedicationReminderCreateReq request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { message = "User not authenticated." });

            await _reminderService.CreateMedicationRemindersAsync(request, userId);
            return StatusCode(201, new { message = "Nhắc nhở thuốc đã được lưu thành công." });
        }
    }
}