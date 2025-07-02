import axios from "./axiosInstance";

// Kiểu dự đoán chu kỳ
export interface Prediction {
  periodDays: number; // số ngày có kinh
  ovulationDay: number; // ngày rụng trứng (thứ tự trong chu kỳ)
  fertileStart: string; // ngày bắt đầu vùng màu mỡ
  fertileEnd: string; // ngày kết thúc vùng màu mỡ
  ovulationDate: string; // ngày rụng trứng (dạng date)
  nextPeriodDate: string; // ngày có kinh tiếp theo
  status: string; // trạng thái
  cycleLength: number; // số ngày chu kỳ
  periodStatus: string; // trạng thái kỳ kinh
  startDate: string;
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
  const response = await axios.get("/menstrual/fertility-status");
  const data = response.data;
  let startDate = data.StartDate || data.startDate || '';
  if (!startDate) {
    // Nếu không có startDate, lấy từ prediction mới nhất của all-predictions
    try {
      const all = await axios.get("/menstrual/all-predictions");
      if (Array.isArray(all.data) && all.data.length > 0) {
        startDate = all.data[all.data.length - 1].startDate || all.data[all.data.length - 1].StartDate || '';
      }
    } catch {}
  }
  return {
    startDate,
    periodDays: data.PeriodLength || data.periodDays || 5,
    ovulationDay: data.OvulationDay || data.ovulationDay || 14,
    fertileStart: data.FertileStart || data.fertileStart || '',
    fertileEnd: data.FertileEnd || data.fertileEnd || '',
    ovulationDate: data.OvulationDate || data.ovulationDate || '',
    nextPeriodDate: data.PredictedNextCycleStartDate || data.nextPeriodDate || '',
    status: data.Status || data.status || '',
    cycleLength: data.CycleLength || data.cycleLength || 28,
    periodStatus: data.PeriodStatus || data.periodStatus || '',
  };
};

// ✅ Lấy thông tin chu kỳ gần nhất
export const getCurrentCycle = async (): Promise<CurrentCycle> => {
  const response = await axios.get("/menstrual/current-cycle-prediction");
  return response.data;
};

// Lấy danh sách prediction cho nhiều chu kỳ
export const getAllPredictions = async (): Promise<Prediction[]> => {
  const response = await axios.get("/menstrual/all-predictions");
  return response.data.map((data: any) => ({
    startDate: data.StartDate || data.startDate || '',
    periodDays: data.PeriodLength || data.periodDays || 5,
    ovulationDay: data.OvulationDay || data.ovulationDay || 14,
    fertileStart: data.FertileStart || data.fertileStart || '',
    fertileEnd: data.FertileEnd || data.fertileEnd || '',
    ovulationDate: data.OvulationDate || data.ovulationDate || '',
    nextPeriodDate: data.PredictedNextCycleStartDate || data.nextPeriodDate || '',
    status: data.Status || data.status || '',
    cycleLength: data.CycleLength || data.cycleLength || 28,
    periodStatus: data.PeriodStatus || data.periodStatus || '',
  }));
};
