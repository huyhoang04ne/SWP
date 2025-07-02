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

        [Authorize(Roles = "Counselor")]
        [HttpGet("my-schedule")]
        public async Task<IActionResult> GetMySchedule()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var res = await _service.GetScheduleByCounselorAsync(userId);
            return Ok(res);
        }

        [Authorize]
        [HttpGet("available-counselors")]
        public async Task<IActionResult> GetAvailableCounselors(DateTime date, TimeSlot timeSlot)
        {
            var res = await _service.GetAvailableCounselors(date, timeSlot);
            return Ok(res);
        }
    }
}