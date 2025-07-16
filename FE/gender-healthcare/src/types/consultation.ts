export interface ConsultationSchedule {
  id: number;
  patientId: string;
  counselorId: string;
  patient: {
    fullName: string;
    email: string;
  };
  counselor: {
    fullName: string;
    email: string;
  };
  scheduledDate: string;
  timeSlot: number; // 0: Morning, 1: Afternoon, 2: Evening
  status: ConsultationStatus;
  isCanceled: boolean;
  notes?: string;
  createdAt: string;
  transferCode?: string; // Mã chuyển khoản
  paymentStatus?: PaymentStatus; // Trạng thái thanh toán
  paymentAmount?: number; // Số tiền thanh toán
  paymentDate?: string; // Ngày thanh toán
}

export enum ConsultationStatus {
  Pending = "Pending",
  Confirmed = "Confirmed", 
  Completed = "Completed",
  Cancelled = "Cancelled",
  NoShow = "NoShow"
}

export enum PaymentStatus {
  Pending = "Pending",
  Paid = "Paid",
  Failed = "Failed",
  Refunded = "Refunded"
}

export enum TimeSlot {
  Morning = 0,
  Afternoon = 1,
  Evening = 2
}

export interface ConsultationFilter {
  fromDate?: string;
  toDate?: string;
  status?: ConsultationStatus;
}

export interface ConsultationStatusUpdateReq {
  status: ConsultationStatus;
  reason?: string;
}

export interface RescheduleProposalReq {
  oldBookingId: number;
  reason: string;
  proposedSlots: Array<{
    date: string;
    timeSlot: number;
  }>;
}

export interface RespondRescheduleReq {
  proposalId: number;
  accept: boolean;
  selectedSlot?: {
    date: string;
    timeSlot: number;
  };
} 