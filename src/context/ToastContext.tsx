import React, { createContext, useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import Toast from "../components/atoms/Toast";

interface ToastItem {
  id: string;
  message: string;
  type?: "info" | "success" | "warning" | "error";
  isExiting?: boolean;
}

interface ToastOptions {
  type?: "info" | "success" | "warning" | "error";
  duration?: number;
}

export interface ToastContextType {
  showToast: (message: string, options?: ToastOptions) => string;
  hideToast: (id: string) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(
  undefined
);

interface ToastProviderProps {
  children: React.ReactNode;
  maxToasts?: number;
  exitDuration?: number;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  maxToasts = 3,
  exitDuration = 300,
}) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [timeouts, setTimeouts] = useState<Record<string, NodeJS.Timeout>>({});

  const startExitAnimation = useCallback(
    (id: string) => {
      setToasts((prevToasts) =>
        prevToasts.map((toast) =>
          toast.id === id ? { ...toast, isExiting: true } : toast
        )
      );

      setTimeout(() => {
        setToasts((prevToasts) =>
          prevToasts.filter((toast) => toast.id !== id)
        );
      }, exitDuration);

      if (timeouts[id]) {
        clearTimeout(timeouts[id]);
        setTimeouts((prev) => {
          const newTimeouts = { ...prev };
          delete newTimeouts[id];
          return newTimeouts;
        });
      }
    },
    [timeouts, exitDuration]
  );

  const hideToast = useCallback(
    (id: string) => {
      startExitAnimation(id);
    },
    [startExitAnimation]
  );

  const showToast = useCallback(
    (message: string, options: ToastOptions = {}) => {
      const { type = "info", duration = 3000 } = options;
      const id = uuidv4();

      setToasts((prevToasts) => {
        const newToasts = [...prevToasts, { id, message, type }];

        if (newToasts.filter((t) => !t.isExiting).length > maxToasts) {
          const oldestToast = newToasts.find((t) => !t.isExiting);
          if (oldestToast) {
            setTimeout(() => {
              startExitAnimation(oldestToast.id);
            }, 0);
          }
        }

        return newToasts;
      });

      const timeoutId = setTimeout(() => {
        hideToast(id);
      }, duration);

      setTimeouts((prev) => ({
        ...prev,
        [id]: timeoutId,
      }));

      return id;
    },
    [hideToast, maxToasts, startExitAnimation]
  );

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <div className="fixed top-5 right-5 flex flex-col-reverse gap-3 z-50">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            isExiting={toast.isExiting}
            onClose={() => hideToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
