import React from "react";
import ButtonWithIcon from "../atoms/ButtonWithIcon";
import { Plus } from "lucide-react";
import { useTaskModal } from "../../hooks/useTaskModal";

interface TasksListProps {
  title: string;
  status: string;
  children?: React.ReactNode;
}

const TasksList: React.FC<TasksListProps> = ({ title, children }) => {
  const { openTaskModal } = useTaskModal();

  return (
    <div className="flex w-64 shrink-0 flex-col relative">
      <div className="bg-primary text-white h-10 rounded-t-xl flex justify-between px-2 items-center sticky  top-0 w-full ">
        <span className=" font-semibold">{title}</span>
        <span className="bg-gray-100 text-gray-600 text-sm font-medium w-6 h-6 flex justify-center items-center rounded-full">
          {children && React.Children.count(children) > 0
            ? React.Children.count(children)
            : 0}
        </span>
      </div>

      <div className="border h-full bg-gray-100 p-2 flex flex-col gap-2">
        {React.Children.count(children) > 0
          ? children
          : "No tasks yet. Click the 'Add Task' button to add a task."}
        <div className="flex justify-center items-center p-2 rounded-lg cursor-pointer">
          <ButtonWithIcon
            bg="no-bg"
            icon={<Plus size={20} />}
            text="Create Task"
            onClick={() => openTaskModal("add")}
          />
        </div>
      </div>
    </div>
  );
};

export default TasksList;
