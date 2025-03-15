const isDevelopment = import.meta.env.VITE_ENVIRONMENT === "development";

export const baseUrl = isDevelopment
  ? "http://localhost:3000/api/v1"
  : import.meta.env.VITE_BASE_BACKEND_URL;
