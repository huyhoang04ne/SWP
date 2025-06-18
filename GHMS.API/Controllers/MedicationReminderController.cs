using GHMS.BLL.Services;
using GHMS.BLL.Svc;
using GHMS.Common.Req;
using GHMS.Common.Resp;
using GHMS.DAL.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace GHMS.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class MedicationReminderController : ControllerBase
    {
        private readonly MedicationReminderSvc _svc;

        public MedicationReminderController(MedicationReminderSvc svc)
        {
            _svc = svc;
        }

        // ✅ Hỗ trợ lấy UserId từ JWT
        private string GetCurrentUserId()
        {
            return User?.FindFirstValue(ClaimTypes.NameIdentifier);
        }

        [HttpPost("create")]
        public IActionResult CreateMedicationReminder([FromBody] MedicationReminderReq req)
        {
            if (req == null)
                return BadRequest("Invalid request.");

            var userId = GetCurrentUserId();
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { message = "Không thể xác định người dùng." });

            // Giả định: ReminderTime là giờ trong ngày
            var now = DateTime.Now.Date.Add(req.ReminderTime);

            // Optional: Bạn có thể thêm logic xử lý loại phác đồ tại đây nếu cần
            switch (req.RegimenType)
            {
                case RegimenType.Pack21Days:
                    Console.WriteLine($"[PACK 21] Nhắc trong 21 ngày từ {now:yyyy-MM-dd HH:mm}");
                    break;

                case RegimenType.Pack28Days:
                    Console.WriteLine($"[PACK 28] Nhắc trong 28 ngày từ {now:yyyy-MM-dd HH:mm}");
                    break;

                default:
                    return BadRequest("Loại phác đồ không hợp lệ.");
            }

            // ✅ Tạo đối tượng và gọi service
            var reminder = new MedicationReminder
            {
                UserId = userId,
                RegimenType = req.RegimenType,
                ReminderTime = req.ReminderTime,
                CreatedAt = DateTime.UtcNow
            };

            var result = _svc.Add(reminder);
            return Ok(result);
        }
    }
}
