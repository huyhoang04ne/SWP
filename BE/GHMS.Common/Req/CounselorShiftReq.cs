using System;
using System.Collections.Generic;

namespace GHMS.Common.Req
{
    public class CounselorShiftReq
    {
        public List<string> CounselorIds { get; set; } = new();
        public List<DateTime> WorkDates { get; set; } = new();
        public List<int> TimeSlots { get; set; } = new(); // 0: Sáng, 1: Chiều, 2: Tối
        public List<Assignment> Assignments { get; set; } = new(); // Format mới: ca cụ thể cho từng ngày
        public string Notes { get; set; } = string.Empty;
        public string? AssignedBy { get; set; } // Id của Manager (nếu có)
        public bool IsAutoAssigned { get; set; } = false; // true: counselor tự đăng ký, false: manager gán
    }

    public class Assignment
    {
        public DateTime Date { get; set; }
        public List<int> Shifts { get; set; } = new(); // Ca được tick cho ngày này
    }
}