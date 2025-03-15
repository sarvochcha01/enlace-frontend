const isDevelopment = import.meta.env.VITE_ENVIRONMENT === "development";

export const baseUrl = isDevelopment
  ? "https://enlace-backend.onrender.com/api/v1"
  : import.meta.env.VITE_BASE_BACKEND_URL;

export const enum LogType {
  Log,
  Warning,
  Error,
}
