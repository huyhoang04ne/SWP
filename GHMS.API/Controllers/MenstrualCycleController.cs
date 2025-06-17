using GHMS.BLL.Svc;
using GHMS.Common.Req;
using GHMS.Common.Resp;
using GHMS.DAL.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GHMS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MenstrualCycleController : ControllerBase
    {
        private readonly MenstrualCycleSvc _svc;
        public MenstrualCycleController(MenstrualCycleSvc svc) => _svc = svc;

        [HttpGet]
        public MultipleRsp List() => _svc.List();

        [HttpGet("{id}")]
        public SingleRsp Get(int id) => _svc.Get(id);

        [HttpGet("days-until/{userId}")]
        public IActionResult DaysUntilNext(string userId) => Ok(_svc.DaysUntilNextCycle(userId));

        [HttpGet("fertility-status/{userId}")]
        public IActionResult FertilityStatus(string userId) => Ok(_svc.TodayFertilityStatus(userId));

        [HttpPost]
        public SingleRsp Create([FromBody] MenstrualCycleReq req)
        {
            var mc = new MenstrualCycle
            {
                UserId = req.UserId,
                CycleStartDate = req.CycleStartDate,
                AverageLength = req.AverageLength,
                Symptoms = req.Symptoms,
                Notes = req.Notes,
                CreatedAt = DateTime.UtcNow
            };
            return _svc.Add(mc);
        }

        [HttpPut("window/{id}")]
        public SingleRsp ComputeWindow(int id) => _svc.ComputeWindow(id);

        [HttpDelete("{id}")]
        public SingleRsp Delete(int id) => _svc.Delete(id);
    }
}
