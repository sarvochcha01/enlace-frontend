import { FC } from "react";
import TaskItem from "./TaskItem";
import { TaskResponseDTO } from "../../models/dtos/Task";

interface TaskListProps {
  tasks?: TaskResponseDTO[] | null;
  heading?: string;
  loading?: boolean;
}

const TaskList: FC<TaskListProps> = ({
  tasks = [],
  heading,
  loading = false,
}) => {
  if (!Array.isArray(tasks) || tasks.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {heading && (
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {heading}
          </h2>
        )}
        <div className="text-center py-8">
          <p className="text-gray-500">No tasks to display</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {heading && (
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{heading}</h2>
        </div>
      )}
      {loading ? (
        <div className="w-full p-6">Loading...</div>
      ) : (
        <div className="divide-y divide-gray-100">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              isCompleted={task.status === "completed"}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
