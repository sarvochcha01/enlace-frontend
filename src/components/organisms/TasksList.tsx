import React, { useState } from "react";
import ButtonWithIcon from "../atoms/ButtonWithIcon";
import { Plus } from "lucide-react";
import { useParams } from "react-router-dom";
import CreateTaskModal from "../modals/CreateTaskModal";
import { AnimatePresence } from "framer-motion";
import { useTaskModal } from "../../hooks/useTaskModal";

interface TasksListProps {
  title: string;
  status: string;
  children?: React.ReactNode;
}

const TasksList: React.FC<TasksListProps> = ({ title, children }) => {
  const { projectId } = useParams<{ projectId: string }>();

  const { openTaskModal } = useTaskModal();

  return (
    <div className="flex flex-col shrink-0 w-64  relative border-2 border-gray-200 rounded-lg">
      <div className="bg-primary text-white p-3 font-medium sticky top-0 w-full   rounded-t-lg border-gray-200 flex justify-between items-center">
        <span className=" font-semibold">{title}</span>
        <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
          {children && React.Children.count(children) > 0
            ? React.Children.count(children)
            : 0}
        </span>
      </div>
      <div className="flex flex-col gap-2 p-2 bg-gray-100 h-full">
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
