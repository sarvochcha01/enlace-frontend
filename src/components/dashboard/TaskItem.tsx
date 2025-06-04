// TaskItem.tsx
import { Calendar, AlertTriangle, CheckCircle2 } from "lucide-react";
import { FC } from "react";
import { TaskResponseDTO } from "../../models/dtos/Task";
import { formatDate } from "../../utils/dateUtils";
import { Link } from "react-router-dom";

interface TaskItemProps {
  task: TaskResponseDTO;
  isCompleted?: boolean;
}

const TaskItem: FC<TaskItemProps> = ({ task, isCompleted = false }) => {
  const priorityColors = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
    critical: "bg-red-800 text-white",
  };

  const getTaskStatusText = (status: string): string => {
    switch (status.toLowerCase()) {
      case "completed":
        return "Completed";
      case "in-progress":
        return "In Progress";
      case "todo":
        return "To Do";
      default:
        return "Unknown Status";
    }
  };

  const renderDateInfo = (): JSX.Element => {
    const isUrgent =
      task.dueDate &&
      new Date(task.dueDate) < new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

    return (
      <div
        className={`col-span-2 flex items-center gap-2 ${
          isUrgent ? "text-red-600" : "text-gray-600"
        }`}
      >
        {isUrgent ? <AlertTriangle size={14} /> : <Calendar size={14} />}
        {formatDate(task.dueDate)}
      </div>
    );
  };

  return (
    <Link
      to={`/projects/${task.projectId}/tasks/${task.id}`}
      className="grid grid-cols-12 py-3 px-2 rounded-lg hover:bg-gray-50 transition-colors items-center text-sm"
    >
      <div
        className={`col-span-5 font-medium ${
          isCompleted ? "line-through text-gray-500" : "text-gray-800"
        }`}
      >
        {task.title}
      </div>
      <div
        className={`col-span-2 ${
          isCompleted ? "text-gray-400" : "text-gray-600"
        }`}
      >
        {task.projectName}
      </div>
      <div className="col-span-2">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            isCompleted
              ? "text-gray-500 bg-gray-100"
              : priorityColors[task.priority]
          }`}
        >
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </span>
      </div>
      {renderDateInfo()}
      <div className="col-span-1">{getTaskStatusText(task.status)}</div>
    </Link>
  );
};

export default TaskItem;
