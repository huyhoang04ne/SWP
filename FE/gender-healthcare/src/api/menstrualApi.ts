import axios from "./axiosInstance";

export const getLoggedDates = async (): Promise<Date[]> => {
  const response = await axios.get("/menstrual/logged-dates");
  return response.data.map((d: string) => new Date(d));
};

export const logPeriodDates = async (periodDates: Date[]): Promise<void> => {
  await axios.post("/menstrual/log", {
    PeriodDates: periodDates, // ✅ viết đúng key theo backend
  });
};