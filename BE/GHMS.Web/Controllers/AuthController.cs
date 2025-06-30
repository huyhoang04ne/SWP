using GHMS.BLL.Services;
using GHMS.Common.Req;
using GHMS.DAL.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace GHMS.Web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly AuthSvc _authSvc;

        public AuthController(AuthSvc authSvc, UserManager<AppUser> userManager)
        {
            _authSvc = authSvc;
            _userManager = userManager;
        }

        [HttpPost("signup")]
        public async Task<IActionResult> Signup([FromBody] RegisterReq req)
        {
            var res = await _authSvc.RegisterAsync(req);
            return res.Success ? Ok(res) : BadRequest(res);
        }


        [HttpDelete("cleanup")]
        public async Task<IActionResult> CleanupUnverifiedUsers()
        {
            var count = await _authSvc.DeleteUnverifiedUsersAsync();
            return Ok(new { message = $"Đã xoá {count} tài khoản chưa xác nhận." });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginReq req)
        {
            var res = await _authSvc.LoginAsync(req);
            return res.Success ? Ok(res) : Unauthorized(res);
        }

        [Authorize]
        [HttpGet("me")]
        public IActionResult GetMe()
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            var email = User.FindFirst(System.Security.Claims.ClaimTypes.Name)?.Value;

            return Ok(new
            {
                message = "You are authenticated!",
                UserId = userId,
                Email = email
            });
        }

        [HttpGet("confirm-email")]
        public async Task<IActionResult> ConfirmEmail(string userId, string token)
        {
            var res = await _authSvc.ConfirmEmailAsync(userId, token);
            return res.Success ? Ok(res.Message) : BadRequest(res.Message);
        }
    }
}
