using GHMS.Common.Req;
using GHMS.Common.Req.GHMS.Common.Req;
using GHMS.DAL.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace GHMS.Web.Controllers
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;

        public AdminController(UserManager<AppUser> userManager)
        {
            _userManager = userManager;
        }

        [HttpPost("create-user")]
        public async Task<IActionResult> CreateInternalUser([FromBody] CreateInternalUserReq req)
        {
            var allowedRoles = new[] { "Manager", "Staff", "Counselor" };
            if (!allowedRoles.Contains(req.Role))
                return BadRequest("Invalid role. Only Manager, Staff, or Counselor are allowed.");

            if (req.Email.EndsWith("@gmail.com"))
                return BadRequest("Please use internal email, not personal Gmail.");

            var user = new AppUser
            {
                UserName = req.Email,
                Email = req.Email,
                EmailConfirmed = true,
                FullName = req.FullName
            };

            var result = await _userManager.CreateAsync(user, req.Password);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            await _userManager.AddToRoleAsync(user, req.Role);
            return Ok("User created successfully.");
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] AdminResetPasswordReq req)
        {
            var user = await _userManager.FindByEmailAsync(req.Email);
            if (user == null)
                return NotFound("User not found");

            var isAdmin = await _userManager.IsInRoleAsync(user, "Admin");
            if (isAdmin)
                return Forbid("You cannot reset the Admin password.");

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var result = await _userManager.ResetPasswordAsync(user, token, req.NewPassword);

            return result.Succeeded
                ? Ok("Password has been reset successfully.")
                : BadRequest(result.Errors);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("delete-user")]
        public async Task<IActionResult> DeleteUser([FromBody] DeleteUserReq req)
        {
            var user = await _userManager.FindByEmailAsync(req.Email);
            if (user == null)
                return NotFound("User not found.");

            // Không cho phép xoá tài khoản admin
            if (await _userManager.IsInRoleAsync(user, "Admin"))
                return Forbid("You cannot delete the Admin account.");

            var result = await _userManager.DeleteAsync(user);
            return result.Succeeded
                ? Ok("User deleted successfully.")
                : BadRequest(result.Errors);
        }
    }
}