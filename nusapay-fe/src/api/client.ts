import axios, { AxiosError } from "axios";

interface ErrorResponse {
  message?: string;
}

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  // baseURL: "https://be-nusapay.vercel.app",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorResponse>) => {
    if (error.code === "ECONNABORTED") {
      return Promise.reject({ message: "Request timeout" });
    }
    return Promise.reject(error.response?.data || { message: "Unknown error" });
  }
);

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const logout = async () => {
  const response = await api.post("/logout"); // backend akan hapus cookie
  return response.data.message;
};
