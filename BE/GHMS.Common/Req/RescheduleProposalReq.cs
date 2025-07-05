using System;
using System.Collections.Generic;

namespace GHMS.Common.Req
{
    public class RescheduleProposalReq
    {
        public int OldBookingId { get; set; }
        public string Reason { get; set; } = default!;
        public List<ProposedSlotDto> ProposedSlots { get; set; } = new();
    }
}
