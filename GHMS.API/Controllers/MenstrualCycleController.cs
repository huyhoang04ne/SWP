using GHMS.BLL.Svc;
using GHMS.Common.Req;
using GHMS.Common.Resp;
using GHMS.DAL.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Security.Claims;

namespace GHMS.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class MenstrualCycleController : ControllerBase
    {
        private readonly MenstrualCycleSvc _svc;

        public MenstrualCycleController(MenstrualCycleSvc svc)
        {
            _svc = svc;
        }

        // Lấy UserId từ JWT token
        private string GetCurrentUserId()
        {
            return User?.FindFirstValue(ClaimTypes.NameIdentifier);
        }

        // Lấy danh sách tất cả các chu kỳ (có thể lọc theo UserId sau)
        [HttpGet]
        public MultipleRsp List()
        {
            return _svc.List();
        }

        // Lấy chu kỳ theo ID
        [HttpGet("{id}")]
        public SingleRsp Get(int id)
        {
            return _svc.Get(id);
        }

        // Tính số ngày còn lại tới kỳ tiếp theo
        [HttpGet("days-until")]
        public IActionResult DaysUntilNext()
        {
            var userId = GetCurrentUserId();
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var days = _svc.DaysUntilNextCycle(userId);
            return Ok(days);
        }

        // Kiểm tra hôm nay có phải giai đoạn dễ thụ thai hay không
        [HttpGet("fertility-status")]
        public IActionResult FertilityStatus()
        {
            var userId = GetCurrentUserId();
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var status = _svc.TodayFertilityStatus(userId);
            return Ok(status);
        }

        // Tạo chu kỳ kinh nguyệt mới
        [HttpPost]
        public SingleRsp Create([FromBody] MenstrualCycleReq req)
        {
            var userId = GetCurrentUserId();

            if (string.IsNullOrEmpty(userId))
            {
                return new SingleRsp
                {
                    Error = "Unauthorized access. Please log in."
                };
            }

            var mc = new MenstrualCycle
            {
                UserId = userId,
                CycleStartDate = req.CycleStartDate,
                AverageLength = req.AverageLength, // Nếu không dùng thì xóa dòng này
                Symptoms = req.Symptoms,
                Notes = req.Notes,
                CreatedAt = DateTime.UtcNow
            };

            return _svc.Add(mc);
        }

        // Tính cửa sổ rụng trứng và khả năng thụ thai
        [HttpPut("window/{id}")]
        public SingleRsp ComputeWindow(int id)
        {
            return _svc.ComputeWindow(id);
        }

        // Xóa chu kỳ
        [HttpDelete("{id}")]
        public SingleRsp Delete(int id)
        {
            return _svc.Delete(id);
        }
    }
}
