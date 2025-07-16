using GHMS.BLL.Services;
using GHMS.Common.Rsp;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GHMS.Web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CounselorController : ControllerBase
    {
        private readonly ConsultationService _consultationService;

        public CounselorController(ConsultationService consultationService)
        {
            _consultationService = consultationService;
        }

        // TODO: Đã chuyển logic phân ca sang ShiftController. Controller này chỉ dùng cho lấy danh sách tư vấn viên.
        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAllCounselors()
        {
            var counselors = await _consultationService.GetAllCounselorsAsync();
            return Ok(counselors);
        }
    }
} 