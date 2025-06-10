import React from "react";
import { ProjectResponseDTO } from "../../models/dtos/Project";
import ProgressBar from "../atoms/ProgressBar";

interface ProjectCardProps {
  project: ProjectResponseDTO;
  onClick?: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  // Calculate days since creation
  const daysSinceCreation = () => {
    const createdDate = new Date(project.createdAt);
    const today = new Date();
    const differenceInTime = today.getTime() - createdDate.getTime();
    const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));

    if (differenceInDays === 0) return "Today";
    if (differenceInDays === 1) return "Yesterday";
    return `${differenceInDays} days ago`;
  };

  return (
    <div
      className="  bg-white border rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer"
      onClick={onClick}
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800">{project.name}</h3>
            <p className="text-sm text-gray-500 mt-1">
              Created: {daysSinceCreation()}
            </p>
          </div>
          <span className="bg-blue-100 text-blue-800 text-xs font-medium py-1 px-2 rounded-full">
            {project.key}
          </span>
        </div>

        <div className="mt-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700">
              Task Progress
            </span>
            <span className="text-sm font-medium text-gray-700">
              {project.tasksCompleted}/{project.totalTasks}
            </span>
          </div>
          <ProgressBar
            progress={project.tasksCompleted}
            total={project.totalTasks}
            showPercentage
          />
        </div>

        {project.activeTasksAssignedToUserCount > 0 && (
          <div className="mt-4 py-2 px-3 bg-amber-50 rounded-lg border border-amber-100">
            <p className="text-sm text-amber-700 flex items-center">
              <span className="font-medium">
                {project.activeTasksAssignedToUserCount}
              </span>
              <span className="ml-1">
                active{" "}
                {project.activeTasksAssignedToUserCount === 1
                  ? "task"
                  : "tasks"}{" "}
                assigned to you
              </span>
            </p>
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
          <div className="text-xs text-gray-500">
            Created by: {project.createdBy.name || project.createdBy.email}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
