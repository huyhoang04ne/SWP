using GHMS.Common.Config;
using GHMS.Common.Req;
using GHMS.Common.Rsp;
using GHMS.DAL.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Web;

namespace GHMS.BLL.Services
{
    public class AuthSvc
    {
        private readonly EmailService _emailService;
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly JwtSettings _jwtSettings;

        public async Task<int> DeleteUnverifiedUsersAsync()
        {
            var expiredUsers = _userManager.Users
                .Where(u => !u.EmailConfirmed && u.CreatedAt < DateTime.UtcNow.AddMinutes(-10))
                .ToList();

            foreach (var user in expiredUsers)
            {
                await _userManager.DeleteAsync(user);
            }

            return expiredUsers.Count;
        }

        public AuthSvc(
            UserManager<AppUser> userManager,
            SignInManager<AppUser> signInManager,
            IOptions<JwtSettings> jwtOptions,
            EmailService emailService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _jwtSettings = jwtOptions.Value;
            _emailService = emailService;
        }

        public async Task<AuthRsp> RegisterAsync(RegisterReq req)
        {
            var existingUser = await _userManager.FindByEmailAsync(req.Email);
            if (existingUser != null)
            {
                return new AuthRsp
                {
                    Success = false,
                    Message = $"Email '{req.Email}' đã được sử dụng. Vui lòng xác nhận email hoặc dùng email khác."
                };
            }

            var user = new AppUser
            {
                UserName = req.Email,
                Email = req.Email,
                FullName = req.FullName,
                Gender = req.Gender,
                DateOfBirth = req.DateOfBirth,
                CreatedAt = DateTime.UtcNow // ⚠ Đừng quên gán thời gian tạo
            };

            var result = await _userManager.CreateAsync(user, req.Password);

            if (!result.Succeeded)
            {
                return new AuthRsp
                {
                    Success = false,
                    Message = string.Join("; ", result.Errors.Select(e => e.Description))
                };
            }

            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            var encodedToken = HttpUtility.UrlEncode(token);
            var confirmUrl = $"https://localhost:7057/api/Auth/confirm-email?userId={user.Id}&token={encodedToken}";

            var emailBody = $"<h3>Vui lòng xác nhận đăng ký:</h3><p><a href='{confirmUrl}'>Bấm vào đây để xác nhận</a></p>";
            await _emailService.SendEmailAsync(user.Email, "Xác nhận đăng ký tài khoản", emailBody);

            return new AuthRsp { Success = true, Message = "Vui lòng kiểm tra email để xác nhận tài khoản." };
        }

        public async Task<AuthRsp> ConfirmEmailAsync(string userId, string token)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return new AuthRsp { Success = false, Message = "Không tìm thấy người dùng." };
            }

            var result = await _userManager.ConfirmEmailAsync(user, token);
            if (result.Succeeded)
            {
                return new AuthRsp { Success = true, Message = "Xác nhận email thành công." };
            }

            return new AuthRsp { Success = false, Message = "Xác nhận email thất bại." };
        }


        public async Task<AuthRsp> LoginAsync(LoginReq req)
        {
            var user = await _userManager.FindByEmailAsync(req.Email);
            if (user == null)
                return new AuthRsp { Success = false, Message = "Không tìm thấy người dùng." };

            if (!await _userManager.IsEmailConfirmedAsync(user))
                return new AuthRsp { Success = false, Message = "Bạn chưa xác nhận email." };

            var result = await _signInManager.CheckPasswordSignInAsync(user, req.Password, false);
            if (!result.Succeeded)
                return new AuthRsp { Success = false, Message = "Sai thông tin đăng nhập." };

            var token = await GenerateJwtToken(user);
            return new AuthRsp { Success = true, Message = "Đăng nhập thành công", Token = token };
        }

        private async Task<string> GenerateJwtToken(AppUser user)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Name, user.UserName ?? "")
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Key));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.UtcNow.AddDays(7);

            var token = new JwtSecurityToken(
                issuer: _jwtSettings.Issuer,
                audience: _jwtSettings.Audience,
                claims: claims,
                expires: expires,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
