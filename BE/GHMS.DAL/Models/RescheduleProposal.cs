using System;
using System.Collections.Generic;

namespace GHMS.DAL.Models
{
    public class RescheduleProposal
    {
        public int Id { get; set; }
        public int OldBookingId { get; set; }
        public string CounselorId { get; set; } = default!;
        public string PatientId { get; set; } = default!;
        public string Reason { get; set; } = default!;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool? PatientAccepted { get; set; }

        public int? SelectedSlotId { get; set; }
        public ProposedSlot? SelectedSlot { get; set; }

        public List<ProposedSlot> ProposedSlots { get; set; } = new List<ProposedSlot>();
    }

    public class ProposedSlot
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public int TimeSlot { get; set; }
        public int RescheduleProposalId { get; set; }
        public RescheduleProposal RescheduleProposal { get; set; } = default!;
    }
}
