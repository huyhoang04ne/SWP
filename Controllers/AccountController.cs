using Microsoft.AspNetCore.Mvc;
using SWP391.Data;
using SWP391.Models;
using System.Linq;
using Microsoft.AspNetCore.Http;

namespace SWP391.Controllers
{
    public class AccountController : Controller
    {
        private readonly GhmsDbContext _context;

        public AccountController(GhmsDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Login()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Login(string email, string password)
        {
            var user = _context.Users.FirstOrDefault(u => u.Email == email);

            if (user == null || user.PasswordHash != password)
            {
                ViewBag.Error = "Sai tài khoản hoặc mật khẩu";
                return View();
            }

            if (user.IsActive != true || user.IsVerified != true)
            {
                ViewBag.Error = "Tài khoản chưa được kích hoạt hoặc xác minh.";
                return View();
            }

            HttpContext.Session.SetString("UserId", user.Id);
            HttpContext.Session.SetString("UserEmail", user.Email);

            return RedirectToAction("Index", "Home");
        }

        public IActionResult Logout()
        {
            HttpContext.Session.Clear();
            return RedirectToAction("Login");
        }
    }
}
