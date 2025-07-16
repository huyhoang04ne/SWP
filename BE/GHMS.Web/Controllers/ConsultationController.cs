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
    [Route("api/appointments")]
    public class ConsultationController : ControllerBase
    {
        private readonly ConsultationService _service;
        private readonly ScheduleService _scheduleService;

        public ConsultationController(ConsultationService service, ScheduleService scheduleService)
        {
            _service = service;
            _scheduleService = scheduleService;
        }

        // Đặt lịch (Patient)
        [Authorize(Roles = "Patient")]
        [HttpPost]
        public async Task<IActionResult> BookConsultation([FromBody] ConsultationBookingReq req)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("Not logged in.");

            BaseResponse res = await _service.BookConsultationAsync(userId, req);
            return res.Success ? Ok(res) : BadRequest(res);
        }

        // Counselor xác nhận/trả lời yêu cầu (confirm/reject)
        [Authorize(Roles = "Counselor")]
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] ConsultationStatusUpdateReq req)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            BaseResponse res = await _service.UpdateConsultationStatusAsync(id, userId, req);
            return res.Success ? Ok(res) : BadRequest(res);
        }

        // Counselor đề xuất đổi lịch
        [Authorize(Roles = "Counselor")]
        [HttpPost("{id}/propose")]
        public async Task<IActionResult> ProposeReschedule(int id, [FromBody] RescheduleProposalReq req)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            req.OldBookingId = id;
            var res = await _service.ProposeRescheduleAsync(userId, req);
            return res.Success ? Ok(res) : BadRequest(res);
        }

        // Patient phản hồi đề xuất đổi lịch
        [Authorize(Roles = "Patient")]
        [HttpPost("{id}/respond-proposal")]
        public async Task<IActionResult> RespondReschedule(int id, [FromBody] RespondRescheduleReq req)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            req.ProposalId = id;
            var res = await _service.RespondRescheduleAsync(userId, req);
            return res.Success ? Ok(res) : BadRequest(res);
        }

        // Huỷ lịch (Patient hoặc Counselor)
        [Authorize(Roles = "Patient,Counselor")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> CancelConsultation(int id, [FromQuery] string? reason = null)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var role = User.FindFirstValue(ClaimTypes.Role);
            if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(role))
                return Unauthorized();

            var res = await _service.CancelConsultationAsync(id, userId, role, reason);
            return res.Success ? Ok(res) : BadRequest(res);
        }

        // Lấy lịch của patient
        [Authorize(Roles = "Patient")]
        [HttpGet("my")]
        public async Task<IActionResult> GetMyBookings()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var res = await _service.GetBookingsByPatientAsync(userId);
            return Ok(res);
        }

        // Lấy lịch của counselor
        [Authorize(Roles = "Counselor")]
        [HttpGet("counselor/my")]
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

        // Đánh dấu no-show (Counselor)
        [Authorize(Roles = "Counselor")]
        [HttpPost("{id}/mark-no-show")]
        public async Task<IActionResult> MarkPatientNoShow(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var res = await _service.MarkPatientNoShowAsync(id, userId);
            return res.Success ? Ok(res) : BadRequest(res);
        }

        // Lấy danh sách lịch có thể đánh dấu no-show
        [Authorize(Roles = "Counselor")]
        [HttpGet("counselor/no-show-candidates")]
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
