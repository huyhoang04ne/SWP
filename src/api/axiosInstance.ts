// src/api/axiosInstance.ts
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://localhost:7057/api", // hoặc "/api" nếu dùng proxy
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      // Không hiện alert và không redirect ở đây nữa
      // Để component tự xử lý lỗi đăng nhập
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;