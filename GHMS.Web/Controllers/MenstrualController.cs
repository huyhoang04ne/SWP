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
            await _service.AddPeriodEntryAsync(userId!, req);
            return Ok(new { message = "Đã ghi nhận kỳ kinh." });
        }

        [HttpGet("fertile-window")]
        public async Task<IActionResult> GetFertileWindow()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var result = await _service.GetFertileWindowAsync(userId!);
            return result == null ? NotFound("Chưa đủ dữ liệu chu kỳ.") : Ok(result);
        }
    }

}
