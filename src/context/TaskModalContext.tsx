import React, { createContext, useState } from "react";

export type TaskModalMode = "add" | "display";

export interface TaskModalContextType {
  isTaskModalOpen: boolean;
  modalMode: TaskModalMode;
  taskId: string | null;
  openTaskModal: (mode: TaskModalMode, id?: string) => void;
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
  const [taskId, setTaskId] = useState<string | null>(null);

  const openTaskModal = async (mode: TaskModalMode, id?: string) => {
    setModalMode(mode);
    setTaskId(id || null);
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
        openTaskModal,
        closeTaskModal,
      }}
    >
      {children}
    </TaskModalContext.Provider>
  );
};

export default TaskModalContext;
