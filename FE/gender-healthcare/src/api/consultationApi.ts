import axiosInstance from "./axiosInstance";

export interface ConsultationBookingReq {
  counselorId?: string; // null hoặc undefined nếu tự động gán
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
    CounselorId: data.counselorId,
    ScheduledDate: new Date(data.date + 'T12:00:00').toISOString(),
    TimeSlot: shiftToNumber(data.shift),
    Notes: data.note ?? ""
  };
  return axiosInstance.post("/appointments", reqData);
};

// Xem lịch tư vấn của patient
export const getMyBookings = () => axiosInstance.get("/appointments/my");

// Xem lịch tư vấn của counselor (với filter)
export const getMyAppointments = (params?: {fromDate?: string, toDate?: string, status?: string}) => 
  axiosInstance.get("/appointments/counselor/my", { params });

// Cập nhật trạng thái
export const updateConsultationStatus = (id: number, status: string, reason?: string) =>
  axiosInstance.put(`/appointments/${id}/status`, { status, reason });

// Đánh dấu vắng mặt
export const markPatientNoShow = (id: number) =>
  axiosInstance.post(`/appointments/${id}/mark-no-show`);

// Hủy lịch
export const cancelConsultation = (id: number, reason?: string) =>
  axiosInstance.delete(`/appointments/${id}?reason=${reason}`);

// Đề xuất đổi lịch
export const proposeReschedule = (data: any) =>
  axiosInstance.post(`/appointments/${data.oldBookingId}/propose`, data);

// Phản hồi đổi lịch
export const respondReschedule = (data: any) =>
  axiosInstance.post(`/appointments/${data.proposalId}/respond-proposal`, data);

// Lấy danh sách ứng viên NoShow
export const getNoShowCandidates = () =>
  axiosInstance.get("/appointments/counselor/no-show-candidates"); 