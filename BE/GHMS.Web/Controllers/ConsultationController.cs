using GHMS.BLL.Services;
using GHMS.Common.Req;
using GHMS.Common.Rsp;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using GHMS.DAL.Models;

namespace GHMS.Web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ConsultationController : ControllerBase
    {
        private readonly ConsultationService _service;
        private readonly ScheduleService _scheduleService;

        public ConsultationController(ConsultationService service, ScheduleService scheduleService)
        {
            _service = service;
            _scheduleService = scheduleService;
        }

        [Authorize(Roles = "Patient")]
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

        [Authorize(Roles = "Patient")]
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
        public async Task<IActionResult> GetMyAppointments(
            [FromQuery] DateTime? fromDate,
            [FromQuery] DateTime? toDate,
            [FromQuery] ConsultationStatus? status)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var res = await _service.GetAppointmentsByCounselorWithFilterAsync(userId, fromDate, toDate, status);
            return Ok(res);
        }

        [Authorize(Roles = "Patient,Counselor")]
        [HttpDelete("cancel/{id}")]
        public async Task<IActionResult> CancelConsultation(int id, [FromQuery] string? reason = null)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var role = User.FindFirstValue(ClaimTypes.Role);
            if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(role))
                return Unauthorized();

            var res = await _service.CancelConsultationAsync(id, userId, role, reason);
            return res.Success ? Ok(res) : BadRequest(res);
        }

        [Authorize(Roles = "Counselor")]
        [HttpPost("propose-reschedule")]
        public async Task<IActionResult> ProposeReschedule([FromBody] RescheduleProposalReq req)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var res = await _service.ProposeRescheduleAsync(userId, req);
            return res.Success ? Ok(res) : BadRequest(res);
        }

        [Authorize(Roles = "Patient")]
        [HttpPost("respond-reschedule")]
        public async Task<IActionResult> RespondReschedule([FromBody] RespondRescheduleReq req)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var res = await _service.RespondRescheduleAsync(userId, req);
            return res.Success ? Ok(res) : BadRequest(res);
        }

        [Authorize(Roles = "Counselor")]
        [HttpPost("mark-no-show/{id}")]
        public async Task<IActionResult> MarkPatientNoShow(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var res = await _service.MarkPatientNoShowAsync(id, userId);
            return res.Success ? Ok(res) : BadRequest(res);
        }

        [Authorize(Roles = "Counselor")]
        [HttpGet("no-show-candidates")]
        public async Task<IActionResult> GetNoShowCandidates()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var consultations = await _service.GetConsultationsForNoShowCheckAsync(userId);
            return Ok(consultations);
        }
    }
}
