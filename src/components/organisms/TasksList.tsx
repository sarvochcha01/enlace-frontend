import React from "react";
import Button from "../atoms/Button";
import { Plus } from "lucide-react";
import { useTaskModal } from "../../hooks/useTaskModal";
import { useProject } from "../../hooks/useProject";

interface TasksListProps {
  title: string;
  status: string;
  children?: React.ReactNode;
}

const TasksList: React.FC<TasksListProps> = ({ title, status, children }) => {
  const { openTaskModal } = useTaskModal();
  const { projectMember } = useProject();

  return (
    <div className="flex w-64 shrink-0 flex-col relative ">
      <div className="bg-primary text-white h-10 rounded-t-lg flex justify-between px-2 items-center sticky  top-0 w-full ">
        <span className=" font-semibold">{title}</span>
        <span className="bg-gray-100 text-gray-600 text-sm font-medium w-6 h-6 flex justify-center items-center rounded-full">
          {children && React.Children.count(children) > 0
            ? React.Children.count(children)
            : 0}
        </span>
      </div>

      <div className="border h-full bg-gray-100 p-2 flex flex-col gap-2 rounded-lg">
        {React.Children.count(children) > 0 ? children : ""}
        {projectMember?.role !== "viewer" && (
          <div className="flex justify-center items-center p-2 rounded-lg cursor-pointer">
            <Button
              bg="no-bg"
              icon={<Plus size={20} />}
              text="Create Task"
              onClick={() => openTaskModal("add", status)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksList;
