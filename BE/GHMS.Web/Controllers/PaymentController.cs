using GHMS.BLL.Services;
using GHMS.Common.Req;
using GHMS.Common.Rsp;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Http;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Collections.Generic;
using OfficeOpenXml;
using System;

namespace GHMS.Web.Controllers
{
    [ApiController]
    [Route("api/payments")]
    public class PaymentController : ControllerBase
    {
        private readonly PaymentService _paymentService;
        public PaymentController(PaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        // Đánh dấu lịch hẹn đã thanh toán (thủ công, cho admin/manager)
        [Authorize(Roles = "Admin,Manager")]
        [HttpPost("appointments/{id}/mark-paid")]
        public async Task<IActionResult> MarkAppointmentPaid(int id)
        {
            var context = HttpContext.RequestServices.GetService(typeof(GHMS.DAL.Data.GHMSContext)) as GHMS.DAL.Data.GHMSContext;
            var booking = context?.ConsultationSchedules.Find(id);
            if (booking == null) return NotFound();
            booking.Status = GHMS.DAL.Models.ConsultationStatus.Paid;
            context.SaveChanges();
            return Ok();
        }

        // Đối soát file sao kê MoMo (CSV hoặc Excel), tự động đánh dấu lịch đã thanh toán
        [Authorize(Roles = "Admin,Manager")]
        [HttpPost("upload-statement")]
        public async Task<IActionResult> UploadMomoStatement(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("Vui lòng chọn file sao kê MoMo (CSV hoặc Excel).");

            var context = HttpContext.RequestServices.GetService(typeof(GHMS.DAL.Data.GHMSContext)) as GHMS.DAL.Data.GHMSContext;
            if (context == null)
                return StatusCode(500, "Không lấy được DbContext.");

            var results = new List<object>();
            var bookings = context.ConsultationSchedules.Where(x => x.TransferCode != null && x.Status != GHMS.DAL.Models.ConsultationStatus.Paid).ToList();
            var now = DateTime.UtcNow;

            if (file.FileName.EndsWith(".xlsx"))
            {
                using (var stream = file.OpenReadStream())
                using (var package = new ExcelPackage(stream))
                {
                    var worksheet = package.Workbook.Worksheets.First();
                    int rowCount = worksheet.Dimension.Rows;
                    int colCount = worksheet.Dimension.Columns;
                    int contentCol = -1, amountCol = -1, timeCol = -1;
                    // Tìm cột nội dung chuyển khoản, số tiền, thời gian
                    for (int col = 1; col <= colCount; col++)
                    {
                        var header = worksheet.Cells[1, col].Text.ToLower();
                        if (header.Contains("nội dung") || header.Contains("description") || header.Contains("content")) contentCol = col;
                        if (header.Contains("số tiền") || header.Contains("amount")) amountCol = col;
                        if (header.Contains("thời gian") || header.Contains("date")) timeCol = col;
                    }
                    if (contentCol == -1) return BadRequest("Không tìm thấy cột nội dung chuyển khoản trong file Excel.");
                    for (int row = 2; row <= rowCount; row++)
                    {
                        var content = worksheet.Cells[row, contentCol].Text.Trim();
                        var amount = amountCol > 0 ? worksheet.Cells[row, amountCol].Text.Trim() : null;
                        var time = timeCol > 0 ? worksheet.Cells[row, timeCol].Text.Trim() : null;
                        var booking = bookings.FirstOrDefault(x => content.Contains(x.TransferCode));
                        if (booking != null)
                        {
                            booking.Status = GHMS.DAL.Models.ConsultationStatus.Paid;
                            results.Add(new { booking.Id, booking.TransferCode, Amount = amount, Time = time, Status = "Đã đánh dấu đã thanh toán" });
                        }
                        else
                        {
                            results.Add(new { TransferCode = content, Amount = amount, Time = time, Status = "Không tìm thấy lịch phù hợp" });
                        }
                    }
                    await context.SaveChangesAsync();
                }
            }
            else // CSV
            {
                using (var stream = file.OpenReadStream())
                using (var reader = new StreamReader(stream))
                {
                    int lineNum = 0;
                    int contentCol = 3, amountCol = -1, timeCol = -1;
                    string[]? headers = null;
                    while (!reader.EndOfStream)
                    {
                        var line = await reader.ReadLineAsync();
                        lineNum++;
                        if (lineNum == 1)
                        {
                            headers = line.Split(',');
                            for (int i = 0; i < headers.Length; i++)
                            {
                                var h = headers[i].ToLower();
                                if (h.Contains("nội dung") || h.Contains("description") || h.Contains("content")) contentCol = i;
                                if (h.Contains("số tiền") || h.Contains("amount")) amountCol = i;
                                if (h.Contains("thời gian") || h.Contains("date")) timeCol = i;
                            }
                            continue;
                        }
                        if (string.IsNullOrWhiteSpace(line)) continue;
                        var cols = line.Split(',');
                        if (cols.Length <= contentCol) continue;
                        var content = cols[contentCol].Trim();
                        var amount = amountCol >= 0 && cols.Length > amountCol ? cols[amountCol].Trim() : null;
                        var time = timeCol >= 0 && cols.Length > timeCol ? cols[timeCol].Trim() : null;
                        var booking = bookings.FirstOrDefault(x => content.Contains(x.TransferCode));
                        if (booking != null)
                        {
                            booking.Status = GHMS.DAL.Models.ConsultationStatus.Paid;
                            results.Add(new { booking.Id, booking.TransferCode, Amount = amount, Time = time, Status = "Đã đánh dấu đã thanh toán" });
                        }
                        else
                        {
                            results.Add(new { TransferCode = content, Amount = amount, Time = time, Status = "Không tìm thấy lịch phù hợp" });
                        }
                    }
                    await context.SaveChangesAsync();
                }
            }
            return Ok(new { Message = $"Đã đối soát {results.Count} giao dịch.", Results = results });
        }
    }
} 