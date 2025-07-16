using GHMS.BLL.Services;
using GHMS.Common.Req;
using GHMS.DAL.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace GHMS.Web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ScheduleController : ControllerBase
    {
        private readonly ScheduleService _service;

        public ScheduleController(ScheduleService service)
        {
            _service = service;
        }

        [Authorize(Roles = "Manager")]
        [HttpPost("assign")]
        public async Task<IActionResult> AssignShift([FromBody] CounselorShiftReq req)
        {
            var result = await _service.AssignShiftAsync(req);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        [Authorize(Roles = "Manager")]
        [HttpPost("assign-multi")]
        public async Task<IActionResult> AssignShiftMulti([FromBody] CounselorShiftReq req)
        {
            var result = await _service.AssignShiftAsync(req);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        [Authorize(Roles = "Counselor")]
        [HttpGet("my-schedule")]
        public async Task<IActionResult> GetMySchedule()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var res = await _service.GetScheduleByCounselorAsync(userId);
            return Ok(res);
        }

        [Authorize(Roles = "Manager")]
        [HttpGet("counselor-schedule")]
        public async Task<IActionResult> GetCounselorSchedule(
            [FromQuery] string counselorId,
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null)
        {
            var res = await _service.GetScheduleByCounselorAsync(counselorId, fromDate, toDate);
            return Ok(res);
        }

        [HttpGet("counselor-working-slots")]
        public async Task<IActionResult> GetCounselorWorkingSlots(
            [FromQuery] string counselorId,
            [FromQuery] DateTime fromDate,
            [FromQuery] DateTime toDate)
        {
            var res = await _service.GetCounselorWorkingSlotsAsync(counselorId, fromDate, toDate);
            return Ok(res);
        }

        [Authorize]
        [HttpGet("available-counselors")]
        public async Task<IActionResult> GetAvailableCounselors(DateTime date, TimeSlot timeSlot)
        {
            var res = await _service.GetAvailableCounselors(date, timeSlot);
            return Ok(res);
        }

        [HttpGet("available-slots")]
        public async Task<IActionResult> GetAvailableSlots(
            [FromQuery] DateTime fromDate,
            [FromQuery] DateTime toDate,
            [FromQuery] string? counselorId = null)
        {
            var slots = await _service.GetAvailableSlotsAsync(fromDate, toDate, counselorId);
            return Ok(slots);
        }
    }
}