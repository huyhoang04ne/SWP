// src/api/authApi.ts
import axiosInstance from "./axiosInstance";

export const login = (data: { email: string; password: string }) => {
  return axiosInstance.post("/auth/login", data);
};

export const getMe = () => axiosInstance.get("/auth/me");

export const fetchLoggedDates = () => axiosInstance.get("/menstrual/logged-dates");

export const savePeriodDates = (dates: Date[]) =>
  axiosInstance.post("/menstrual/log", { periodDates: dates });

export const getPrediction = () => axiosInstance.get("/menstrual/prediction");

export const getCurrentCycle = () => axiosInstance.get("/menstrual/current-cycle-prediction");