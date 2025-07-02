using GHMS.DAL.Models;

namespace GHMS.Common.Req
{
    public class ConsultationStatusUpdateReq
    {
        public ConsultationStatus Status { get; set; }
        public string? Reason { get; set; }
    }
}