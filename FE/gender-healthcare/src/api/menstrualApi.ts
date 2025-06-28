import axios from "./axiosInstance";

// Kiểu dự đoán chu kỳ
export interface Prediction {
  OvulationDate: string;
  FertileStart: string;
  FertileEnd: string;
  Status: string;
  PeriodStatus: string;
  NextPeriodDate: string;
}

// Kiểu chu kỳ gần nhất
export interface CurrentCycle {
  StartDate: string;
  PeriodLength: number;
  CycleLength: number;
  PredictedNextCycleStartDate: string;
}

// ✅ Trả về danh sách ngày đã log kỳ kinh
export const getLoggedDates = async (): Promise<Date[]> => {
  const response = await axios.get("/menstrual/logged-dates");
  return response.data.map((d: string) => new Date(d));
};

// ✅ Ghi nhận kỳ kinh (đã chuẩn hoá giờ để tránh lệch ngày)
export const logPeriodDates = async (periodDates: Date[]): Promise<void> => {
  const normalizedDates = periodDates.map((date) => {
    const d = new Date(date);
    d.setHours(12, 0, 0, 0); // 👈 đặt giờ giữa ngày để không bị lùi ngày khi convert sang UTC
    return d.toISOString(); // 👈 gửi dưới dạng ISO string
  });

  await axios.post("/menstrual/log", {
    PeriodDates: normalizedDates,
  });
};

// ✅ Dự đoán rụng trứng, vùng màu mỡ, ngày có kinh tiếp theo
export const getPrediction = async (): Promise<Prediction> => {
  const response = await axios.get("/menstrual/prediction");
  return response.data;
};

// ✅ Lấy thông tin chu kỳ gần nhất
export const getCurrentCycle = async (): Promise<CurrentCycle> => {
  const response = await axios.get("/menstrual/current-cycle-prediction");
  return response.data;
};
