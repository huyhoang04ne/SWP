import axiosInstance from "./axiosInstance";

export interface ConsultationBookingReq {
  counselorId?: number; // null hoặc 0 nếu tự động gán
  date: string; // yyyy-MM-dd
  shift: string; // "morning" | "afternoon" | "evening"
  note?: string;
}

function shiftToNumber(shift: string) {
  switch (shift.toLowerCase()) {
    case "morning": return 0;
    case "afternoon": return 1;
    case "evening": return 2;
    default: return 0;
  }
}

export const bookConsultation = (data: ConsultationBookingReq) => {
  // Gửi object phẳng, PascalCase, TimeSlot là số
  const reqData = {
    CounselorId: data.counselorId !== undefined ? String(data.counselorId) : undefined,
    ScheduledDate: new Date(data.date + 'T12:00:00').toISOString(),
    TimeSlot: shiftToNumber(data.shift),
    Notes: data.note ?? ""
  };
  return axiosInstance.post("/consultation/book", reqData);
}; 