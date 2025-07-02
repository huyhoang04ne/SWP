using GHMS.DAL.Models;
using System;

namespace GHMS.Common.Req
{
    public class CounselorShiftReq
    {
        public string CounselorId { get; set; }
        public DateTime WorkDate { get; set; }
        public TimeSlot TimeSlot { get; set; }
        public string? Notes { get; set; }
    }
}