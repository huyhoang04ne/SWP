using GHMS.BLL.Services;
using GHMS.Common.Req;
using GHMS.DAL.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace GHMS.Web.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class MenstrualController : ControllerBase
    {
        private readonly MenstrualCycleService _service;
        private readonly UserManager<AppUser> _userManager;

        public MenstrualController(MenstrualCycleService service, UserManager<AppUser> userManager)
        {
            _service = service;
            _userManager = userManager;
        }

        [HttpPost("log")]
        public async Task<IActionResult> LogPeriod([FromBody] MenstrualCycleCreateReq req)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { message = "User not authenticated." });

            try
            {
                await _service.AddPeriodEntryAsync(userId, req);
                return Ok(new { message = "Đã ghi nhận kỳ kinh." });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Đã xảy ra lỗi khi ghi nhận kỳ kinh.", error = ex.Message });
            }
        }

        [HttpGet("prediction")]
        public async Task<IActionResult> GetPrediction()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var fertile = await _service.GetFertileWindowAsync(userId!);
            if (fertile == null)
                return NotFound("Chưa đủ dữ liệu để dự đoán.");

            var today = DateTime.UtcNow.Date;
            var isInFertileWindow = today >= fertile.FertileStart && today <= fertile.FertileEnd;
            var nextPeriod = fertile.OvulationDate.AddDays(14);

            return Ok(new
            {
                OvulationDate = fertile.OvulationDate,
                FertileStart = fertile.FertileStart,
                FertileEnd = fertile.FertileEnd,
                Status = isInFertileWindow ? "High" : "Low",
                DaysUntilNextPeriod = (nextPeriod - today).Days,
                NextPeriodDate = nextPeriod
            });
        }

        [HttpGet("logged-dates")]
        public async Task<IActionResult> GetLoggedDates()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var days = await _service.GetAllPeriodDatesAsync(userId!);
            return Ok(days);
        }

        [HttpGet("current-cycle-prediction")]
        public async Task<IActionResult> GetCurrentCyclePrediction()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("User not authenticated.");

            var prediction = await _service.GetCurrentCyclePredictionAsync(userId);
            if (prediction == null)
                return NotFound("Chưa có dữ liệu kỳ kinh.");

            return Ok(prediction);
        }
    }
}