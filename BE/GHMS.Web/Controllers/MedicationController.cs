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

        /// <summary>
        /// Tạo lịch nhắc uống thuốc (ví dụ vỉ 21 hoặc 28 ngày)
        /// </summary>
        [HttpPost("set-reminder")]
        public async Task<IActionResult> SetReminder([FromBody] MedicationReminderCreateReq request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { message = "User not authenticated." });

            try
            {
                await _reminderService.CreateMedicationRemindersAsync(request, userId);
                return StatusCode(201, new { message = "Nhắc nhở thuốc đã được lưu thành công." });
            }
            catch (Exception ex)
            {
                var baseException = ex.GetBaseException(); // 👈 Lấy lỗi gốc sâu nhất
                return StatusCode(500, new
                {
                    message = "Đã xảy ra lỗi khi lưu lịch nhắc.",
                    error = baseException.Message
                });
            }

        }

        /// <summary>
        /// Đánh dấu 1 lần nhắc là đã uống thuốc
        /// </summary>
        [HttpPost("mark-as-taken/{id}")]
        public async Task<IActionResult> MarkAsTaken(string id)
        {
            var success = await _reminderService.MarkReminderAsTakenAsync(id);
            if (!success)
                return NotFound(new { message = "Không tìm thấy lịch nhắc." });

            return Ok(new { message = "Đã đánh dấu là đã uống thuốc." });
        }
    }
}
