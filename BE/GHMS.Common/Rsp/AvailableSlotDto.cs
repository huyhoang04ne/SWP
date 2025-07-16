using System;
using System.Collections.Generic;

namespace GHMS.Common.Rsp
{
    public class AvailableSlotDto
    {
        public DateTime Date { get; set; }
        public List<int> TimeSlots { get; set; } = new();
    }
} 