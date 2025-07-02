using GHMS.BLL.Services;
using GHMS.Common.Req;
using GHMS.DAL.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace GHMS.Web.Controllers
{
    [Authorize(Roles = "Patient")]
    [ApiController]
    [Route("api/[controller]")]
    public class MedicationController : ControllerBase
    {
        private readonly MedicationReminderService _service;

        public MedicationController(MedicationReminderService service)
        {
            _service = service;
        }

        /// <summary>
        /// Ghi nhận hoặc cập nhật lịch nhắc thuốc
        /// </summary>
        [HttpPost("schedule")]
        public async Task<IActionResult> SetSchedule([FromBody] SetScheduleReq req)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("User not authenticated.");

            try
            {
                await _service.SetOrUpdateScheduleSmartAsync(userId, req);
                return Ok(new { message = "Đã lưu lịch nhắc thuốc." });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Đã xảy ra lỗi khi lưu lịch nhắc thuốc.", error = ex.Message });
            }
        }

        /// <summary>
        /// (Tuỳ chọn) Lấy thông tin lịch nhắc hiện tại
        /// </summary>
        [HttpGet("current-schedule")]
        public async Task<IActionResult> GetCurrentSchedule()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("User not authenticated.");

            var schedule = await _service.GetCurrentScheduleAsync(userId);
            if (schedule == null)
                return NotFound("Chưa có lịch nhắc thuốc.");

            return Ok(schedule);
        }
    }
}
