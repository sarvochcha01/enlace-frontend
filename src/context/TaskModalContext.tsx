import React, { createContext, useState } from "react";

export type TaskModalMode = "add" | "display";

export interface TaskModalContextType {
  isTaskModalOpen: boolean;
  modalMode: TaskModalMode;
  taskId: string | null;
  status: string | null;
  openTaskModal: (
    mode: TaskModalMode,
    status: string | null,
    id?: string
  ) => void;
  closeTaskModal: () => void;
}

const TaskModalContext = createContext<TaskModalContextType | null>(null);

interface TaskModalProviderProps {
  children: React.ReactNode;
}

export const TaskModalProvider: React.FC<TaskModalProviderProps> = ({
  children,
}) => {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<TaskModalMode>("add");
  const [status, setStatus] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);

  const openTaskModal = async (
    mode: TaskModalMode,
    status: string | null,
    id?: string
  ) => {
    setModalMode(mode);
    setTaskId(id || null);
    setStatus(status || null);
    setIsTaskModalOpen(true);
  };

  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
    // Optionally reset the mode and taskId when closing
    // setModalMode("add");
    // setTaskId(null);
  };

  return (
    <TaskModalContext.Provider
      value={{
        isTaskModalOpen,
        modalMode,
        taskId,
        status,
        openTaskModal,
        closeTaskModal,
      }}
    >
      {children}
    </TaskModalContext.Provider>
  );
};

export default TaskModalContext;
