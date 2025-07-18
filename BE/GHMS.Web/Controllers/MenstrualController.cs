﻿using GHMS.BLL.Services;
using GHMS.Common.Req;
using GHMS.DAL.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace GHMS.Web.Controllers
{
    [Authorize(Roles = "Patient")]
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

        /// <summary>
        /// Ghi nhận hoặc cập nhật các ngày có kinh
        /// </summary>
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

        /// <summary>
        /// Trả về dự đoán kỳ rụng trứng, vùng màu mỡ và ngày hành kinh kế tiếp
        /// </summary>
        [HttpGet("cycle-summary")]
        public async Task<IActionResult> GetCycleSummary()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("User not authenticated.");

            var prediction = await _service.GetCurrentCyclePredictionAsync(userId);
            if (prediction == null)
                return NotFound("Chưa có dữ liệu kỳ kinh.");

            var recentCycles = await _service.GetRecentCyclesAsync(userId, 5);
            var avgCycleLength = recentCycles.Any()
                ? Math.Round(recentCycles.Average(c => c.CycleLength))
                : 0;

            var avgPeriodLength = recentCycles.Any()
                ? Math.Round(recentCycles.Average(c => c.PeriodLength))
                : 0;

            return Ok(new
            {
                prediction.StartDate,
                prediction.PeriodLength,
                prediction.CycleLength,
                prediction.PredictedNextCycleStartDate,
                AverageCycleLength = avgCycleLength,
                AveragePeriodLength = avgPeriodLength,
                TotalCyclesAvailable = recentCycles.Count
            });
        }

        /// <summary>
        /// Trả về danh sách các ngày đã log hành kinh
        /// </summary>
        [HttpGet("logged-dates")]
        public async Task<IActionResult> GetLoggedDates()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var days = await _service.GetAllPeriodDatesAsync(userId!);
            return Ok(days);
        }

        /// <summary>
        /// Trả về trạng thái màu mỡ (fertile), ngày rụng trứng và dự đoán kỳ tới – phục vụ giao diện biểu đồ
        /// </summary>
        [HttpGet("fertility-status")]
        public async Task<IActionResult> GetFertilityStatus()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var fertile = await _service.GetFertileWindowAsync(userId!);

            if (fertile == null)
                return NotFound("Chưa đủ dữ liệu để dự đoán.");

            var today = DateTime.UtcNow.Date;
            var isInFertileWindow = today >= fertile.FertileStart && today <= fertile.FertileEnd;

            var nextPeriod = fertile.StartDate.AddDays(fertile.CycleLength);
            var daysDiff = (today - nextPeriod).Days;

            string periodStatus = daysDiff == 0
                ? "Today"
                : daysDiff < 0 ? $"{Math.Abs(daysDiff)} days left"
                : $"{daysDiff} days late";

            return Ok(new
            {
                fertile.OvulationDate,
                fertile.FertileStart,
                fertile.FertileEnd,
                NextPeriodDate = nextPeriod,
                Status = isInFertileWindow ? "High" : "Low",
                PeriodStatus = periodStatus
            });
        }


        [HttpGet("analytics")]
        public async Task<IActionResult> GetCycleAnalytics()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("User not authenticated.");

            var cycles = await _service.GetRecentCyclesAsync(userId, 5);
            if (cycles == null || !cycles.Any())
                return NotFound("No cycle data available.");

            var avgCycleLength = Math.Round(cycles.Average(c => c.CycleLength));
            var avgPeriodLength = Math.Round(cycles.Average(c => c.PeriodLength));

            var lastCycle = cycles.Last();

            return Ok(new
            {
                LastCycleLength = lastCycle.CycleLength,
                LastPeriodLength = lastCycle.PeriodLength,
                AverageCycleLength = avgCycleLength,
                AveragePeriodLength = avgPeriodLength,
                CycleTrend = cycles.Select(c => new { c.StartDate, c.CycleLength }),
                PeriodTrend = cycles.Select(c => new { c.StartDate, c.PeriodLength }),
                TotalCyclesAvailable = cycles.Count
            });
        }

        /// <summary>
        /// Trả về danh sách prediction cho tất cả các chu kỳ đã nhập
        /// </summary>
        [HttpGet("all-predictions")]
        public async Task<IActionResult> GetAllCyclePredictions()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("User not authenticated.");

            var predictions = await _service.GetAllCyclePredictionsAsync(userId);
            return Ok(predictions);
        }
    }
}
