using GHMS.BLL.Services;
using GHMS.Common.Req;
using GHMS.Common.Rsp;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace GHMS.Web.Controllers
{
    [Authorize(Roles = "Patient")]
    [ApiController]
    [Route("api/[controller]")]
    public class ConsultationController : ControllerBase
    {
        private readonly ConsultationService _service;

        public ConsultationController(ConsultationService service)
        {
            _service = service;
        }

        [HttpPost("book")]
        public async Task<IActionResult> BookConsultation([FromBody] ConsultationBookingReq req)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("Not logged in.");

            BaseResponse res = await _service.BookConsultationAsync(userId, req);
            return res.Success ? Ok(res) : BadRequest(res);
        }

        [Authorize(Roles = "Counselor")]
        [HttpPut("update-status/{id}")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] ConsultationStatusUpdateReq req)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            BaseResponse res = await _service.UpdateConsultationStatusAsync(id, userId, req);
            return res.Success ? Ok(res) : BadRequest(res);
        }

        [HttpGet("my-bookings")]
        public async Task<IActionResult> GetMyBookings()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var res = await _service.GetBookingsByPatientAsync(userId);
            return Ok(res);
        }

        [Authorize(Roles = "Counselor")]
        [HttpGet("my-appointments")]
        public async Task<IActionResult> GetMyAppointments()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var res = await _service.GetAppointmentsByCounselorAsync(userId);
            return Ok(res);
        }
    }
}
