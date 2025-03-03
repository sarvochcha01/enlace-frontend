import { useContext } from "react";
import TaskModalContext, {
  TaskModalContextType,
} from "../context/TaskModalContext";

export const useTaskModal = (): TaskModalContextType => {
  const context = useContext(TaskModalContext);
  if (!context) {
    throw new Error("useTaskModal must be used within a TaskModalProvider");
  }
  return context;
};
