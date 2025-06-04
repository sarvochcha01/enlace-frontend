import { FC } from "react";
import TaskItem from "./TaskItem";
import { TaskResponseDTO } from "../../models/dtos/Task";

interface TaskListProps {
  tasks?: TaskResponseDTO[] | null; // Accept null or undefined safely
  isCompleted?: boolean;
}

const TaskList: FC<TaskListProps> = ({ tasks = [], isCompleted = false }) => {
  if (!Array.isArray(tasks) || tasks.length === 0) {
    return <div className="text-sm text-gray-400">No tasks to show.</div>;
  }

  return (
    <div className="space-y-1">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} isCompleted={isCompleted} />
      ))}
    </div>
  );
};

export default TaskList;
