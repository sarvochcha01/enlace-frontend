import {
  Calendar,
  AlertTriangle,
  Clock,
  User,
  FolderKanban,
} from "lucide-react";
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
    low: "bg-green-50 text-green-700 border-green-200",
    medium: "bg-yellow-50 text-yellow-700 border-yellow-200",
    high: "bg-orange-50 text-orange-700 border-orange-200",
    critical: "bg-red-50 text-red-700 border-red-200",
  };

  const statusColors = {
    completed: "bg-green-50 text-green-700",
    "in-progress": "bg-blue-50 text-blue-700",
    todo: "bg-gray-50 text-gray-700",
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
        return "Unknown";
    }
  };

  const isUrgent =
    task.dueDate &&
    new Date(task.dueDate) < new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

  return (
    <Link
      to={`/projects/${task.projectId}/tasks/${task.id}`}
      className="block hover:bg-gray-50 transition-colors"
    >
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3
                className={`font-medium truncate ${
                  isCompleted ? "line-through text-gray-500" : "text-gray-900"
                }`}
              >
                {task.title}{" "}
                {task.projectKey
                  ? `(${task.projectKey} - ${task.taskNumber})`
                  : ""}
              </h3>
              {isUrgent && (
                <AlertTriangle
                  className="text-red-500 flex-shrink-0"
                  size={16}
                />
              )}
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <FolderKanban size={14} />
                {task.projectName}
              </span>

              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {task.dueDate ? formatDate(task.dueDate) : "No Due Date"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 ml-4">
            <span
              className={`px-2 py-1 text-xs font-medium rounded-md border ${
                priorityColors[task.priority as keyof typeof priorityColors]
              }`}
            >
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>

            <span
              className={`px-2 py-1 text-xs font-medium rounded-md ${
                statusColors[
                  task.status.toLowerCase() as keyof typeof statusColors
                ] || "bg-gray-50 text-gray-700"
              }`}
            >
              {getTaskStatusText(task.status)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TaskItem;
