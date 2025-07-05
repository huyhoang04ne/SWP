using System;

namespace GHMS.Common.Req
{
    public class RespondRescheduleReq
    {
        public int ProposalId { get; set; }
        public bool Accept { get; set; }
        public ProposedSlotDto? SelectedSlot { get; set; }
    }

    public class ProposedSlotDto
    {
        public DateTime Date { get; set; }
        public int TimeSlot { get; set; }
    }
}
