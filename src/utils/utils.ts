export const baseUrl = "http://localhost:3000/api/v1";

export const enum LogType {
  Log,
  Warning,
  Error,
}

export const devLog = (type: LogType, ...args: any[]) => {
  if (import.meta.env.VITE_ENVIRONMENT === "development") {
    // Use the LogType enum to decide the log level
    switch (type) {
      case LogType.Error:
        console.error(...args); // For error logs
        break;
      case LogType.Warning:
        console.warn(...args); // For warning logs
        break;
      case LogType.Log:
        console.log(...args); // For general log messages
        break;
      default:
        console.log("Unknown log type:", ...args); // Default fallback for unknown types
        break;
    }
  }
};

export const formatDate = (date: string) => {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const formatDateAndTime = (date: string) => {
  if (!date) return "";

  return new Date(date).toLocaleString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
};

export const getInitials = (fullName: string) => {
  return fullName
    .split(" ")
    .map((word) => word[0].toUpperCase())
    .join("");
};
