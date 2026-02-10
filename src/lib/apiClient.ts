import axios, { AxiosInstance } from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api";

// Create axios instance
const instance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const message = error.response.data?.message || error.message;
      error.message = message;
    } else if (error.request) {
      error.message = "Network error. Please check your connection.";
    }
    return Promise.reject(error);
  },
);

// Export HTTP methods
export const apiClient = {
  get: async <T>(url: string): Promise<T> => {
    const response = await instance.get<T>(url);
    return response.data;
  },

  post: async <T>(url: string, data?: unknown): Promise<T> => {
    const response = await instance.post<T>(url, data);
    return response.data;
  },

  put: async <T>(url: string, data?: unknown): Promise<T> => {
    const response = await instance.put<T>(url, data);
    return response.data;
  },

  delete: async <T>(url: string): Promise<T> => {
    const response = await instance.delete<T>(url);
    return response.data;
  },

  uploadFile: async <T>(
    url: string,
    file: File,
    onProgress?: (percent: number) => void,
  ): Promise<T> => {
    const response = await instance.put<T>(url, file, {
      headers: { "Content-Type": "application/octet-stream" },
      onUploadProgress: (event) => {
        if (event.total && onProgress) {
          const percent = Math.round((event.loaded * 100) / event.total);
          onProgress(percent);
        }
      },
    });
    return response.data;
  },
};
