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
    public class MedicationReminderController : ControllerBase
    {
        private readonly MedicationReminderSvc _svc;
        public MedicationReminderController(MedicationReminderSvc svc) => _svc = svc;

        [HttpGet]
        public MultipleRsp List() => _svc.List();

        [HttpGet("next/{id}")]
        public ActionResult<DateTime?> Next(int id) => _svc.Next(id);

        [HttpPost]
        public SingleRsp Create([FromBody] MedicationReminderReq req)
        {
            var mr = new MedicationReminder
            {
                UserId = req.UserId,
                ReminderTime = req.ReminderTime,
                Frequency = req.Frequency,
                Message = req.Message,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };
            return _svc.Add(mr);
        }

        [HttpDelete("{id}")]
        public SingleRsp Delete(int id) => _svc.Delete(id);
    }
}
