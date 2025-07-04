import { Clock } from "lucide-react";
import { useTaskModal } from "../../hooks/useTaskModal";
import { TaskPriority } from "../../models/dtos/Task";
import { getInitials, getNameColor } from "../../utils/nameUtils";
import { cn } from "../../utils/tailwindMerge";
import { useNavigate } from "react-router-dom";

interface TaskHeadingCardProps {
  id: string;
  title?: string;
  dueDate?: string;
  priority: TaskPriority;
  assignedTo?: string;
}

const TaskHeadingCard: React.FC<TaskHeadingCardProps> = ({
  id,
  title,
  dueDate = "No due date",
  priority,
  assignedTo,
}) => {
  const navigate = useNavigate();

  const priorityColors = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
    critical: "bg-red-800 text-white",
  };

  const priorityLabel = {
    low: "Low",
    medium: "Medium",
    high: "High",
    critical: "Critical",
  };

  const nameColor = getNameColor(assignedTo || "");

  return (
    <button
      className="w-full bg-white p-3  border border-gray-200 shadow-sm hover:shadow transition-shadow cursor-pointer "
      onClick={() => navigate(`tasks/${id}`)}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-gray-800 line-clamp-2">{title}</h3>
        <span
          className={`text-xs px-2 py-1 rounded-full ${priorityColors[priority]}`}
        >
          {priorityLabel[priority]}
        </span>
      </div>
      <div className="flex items-center justify-between gap-1 text-xs text-gray-500 mb-2">
        <div className="flex items-center gap-1">
          <Clock size={14} />
          <span>{dueDate}</span>
        </div>
        {assignedTo && (
          <div
            className={cn(
              "w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center",
              nameColor
            )}
          >
            {getInitials(assignedTo)}
          </div>
        )}
      </div>
    </button>
  );
};

export default TaskHeadingCard;
