import { useTaskModal } from "../../hooks/useTaskModal";
import { TaskPriority } from "../../models/task";

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
  const { openTaskModal, closeTaskModal } = useTaskModal();

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
      <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        <span>{dueDate}</span>
      </div>
      {assignee && (
        <div className="flex items-center justify-between mt-2">
          <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs text-indigo-800 font-medium">
            {assignee.charAt(0).toUpperCase()}
          </div>
          <div className="flex gap-1">
            <button className="text-gray-400 hover:text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            <button className="text-gray-400 hover:text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </div>
      )}
    </button>
  );
};

export default TaskHeadingCard;
