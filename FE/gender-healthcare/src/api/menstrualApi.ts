import axios from "./axiosInstance";

// Kiểu dự đoán chu kỳ - đồng bộ với backend
export interface Prediction {
  startDate: string;
  periodLength: number; // số ngày có kinh
  cycleLength: number; // số ngày chu kỳ
  predictedNextCycleStartDate: string;
  ovulationDate: string; // ngày rụng trứng
  fertileStart: string; // ngày bắt đầu vùng màu mỡ
  fertileEnd: string; // ngày kết thúc vùng màu mỡ
  status: string; // trạng thái
  periodStatus: string; // trạng thái kỳ kinh
}

// Kiểu chu kỳ gần nhất - đồng bộ với backend
export interface CurrentCycle {
  startDate: string;
  periodLength: number;
  cycleLength: number;
  predictedNextCycleStartDate: string;
  averageCycleLength: number;
  averagePeriodLength: number;
  totalCyclesAvailable: number;
}

// Kiểu fertility status - đồng bộ với backend
export interface FertilityStatus {
  ovulationDate: string;
  fertileStart: string;
  fertileEnd: string;
  nextPeriodDate: string;
  status: string;
  periodStatus: string;
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
  const response = await axios.get("/menstrual/fertility-status");
  const data = response.data;
  
  return {
    startDate: data.startDate || '',
    periodLength: data.periodLength || 5,
    cycleLength: data.cycleLength || 28,
    predictedNextCycleStartDate: data.nextPeriodDate || '',
    ovulationDate: data.ovulationDate || '',
    fertileStart: data.fertileStart || '',
    fertileEnd: data.fertileEnd || '',
    status: data.status || '',
    periodStatus: data.periodStatus || '',
  };
};

// ✅ Lấy thông tin chu kỳ gần nhất
export const getCurrentCycle = async (): Promise<CurrentCycle> => {
  const response = await axios.get("/menstrual/cycle-summary");
  return response.data;
};

// Lấy danh sách prediction cho nhiều chu kỳ
export const getAllPredictions = async (): Promise<Prediction[]> => {
  const response = await axios.get("/menstrual/all-predictions");
  return response.data.map((data: any) => ({
    startDate: data.startDate || '',
    periodLength: data.periodLength || 5,
    cycleLength: data.cycleLength || 28,
    predictedNextCycleStartDate: data.predictedNextCycleStartDate || '',
    ovulationDate: data.ovulationDate || '',
    fertileStart: data.fertileStart || '',
    fertileEnd: data.fertileEnd || '',
    status: data.status || '',
    periodStatus: data.periodStatus || '',
  }));
};

// Lấy analytics cho chu kỳ
export const getCycleAnalytics = async () => {
  const response = await axios.get("/menstrual/analytics");
  return response.data;
};
