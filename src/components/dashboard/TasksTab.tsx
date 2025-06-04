// TasksTab.tsx
import { FC, MouseEventHandler } from "react";

interface TasksTabProps {
  id: string | number;
  label: string;
  isActive: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

const TasksTab: FC<TasksTabProps> = ({ id, label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-4 font-medium text-sm ${
        isActive
          ? "text-blue-600 border-b-2 border-blue-600"
          : "text-gray-500 hover:text-gray-700"
      }`}
    >
      {label}
    </button>
  );
};

export default TasksTab;
