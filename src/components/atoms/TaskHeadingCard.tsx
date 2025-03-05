import { Clock } from "lucide-react";
import { useTaskModal } from "../../hooks/useTaskModal";
import { TaskPriority } from "../../models/task";
import NameBubble from "./NameBubble";

interface TaskHeadingCardProps {
  id: string;
  title?: string;
  dueDate?: string;
  priority: TaskPriority;
  assignee?: string;
}

const TaskHeadingCard: React.FC<TaskHeadingCardProps> = ({
  id,
  title,
  dueDate = "No due date",
  priority,
  assignee,
}) => {
  const { openTaskModal } = useTaskModal();

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

  return (
    <button
      className="w-full bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow transition-shadow cursor-pointer"
      onClick={() => openTaskModal("display", id)}
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
        {assignee && (
          <NameBubble
            isFilter={false}
            name={assignee}
            isSelected={false}
            zIndex={1}
          />
        )}
      </div>
    </button>
  );
};

export default TaskHeadingCard;
