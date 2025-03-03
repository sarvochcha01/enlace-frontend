import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ToastProps {
  message: string;
  onClose?: () => void;
  type?: "info" | "success" | "warning" | "error";
  isExiting?: boolean;
}

const Toast: React.FC<ToastProps> = ({
  message,
  onClose,
  type = "info",
  isExiting = false,
}) => {
  const bgColors = {
    info: "bg-blue-600",
    success: "bg-green-600",
    warning: "bg-yellow-500",
    error: "bg-red-600",
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          className={` max-w-md px-4 py-2 rounded-lg text-white shadow-lg flex items-center justify-between ${bgColors[type]}`}
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mr-4">{message}</div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 focus:outline-none"
          >
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
