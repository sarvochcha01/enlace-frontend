import React from "react";
import { ProjectResponseDTO } from "../../models/dtos/Project";
import NameBubble from "./NameBubble";
import { Calendar, Info } from "lucide-react";
import { formatDate } from "../../utils/dateUtils";

interface ProjectCardProps {
  project: ProjectResponseDTO;
  onClick?: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const formatDescription = (description: string) => {
    if (description.length > 150) {
      return `${description.slice(0, 150)}...`;
    }
    return description;
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer border border-gray-100 w-72 h-64 flex flex-col"
      onClick={onClick}
    >
      {/* Header section with project name and key */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800 truncate">
            {project.name}
          </h3>
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">
            {project.key}
          </span>
        </div>
      </div>

      {/* Body section with description */}
      <div className="p-4 flex-grow overflow-hidden">
        <p className="text-gray-600 text-sm line-clamp-4">
          {formatDescription(project.description)}
        </p>
      </div>

      {/* Creator info section */}
      <div className="px-4 py-2 border-t border-gray-100">
        <div className="flex items-center">
          <NameBubble name={project.createdBy.name} />
          <span className="text-xs text-gray-500 ml-2 truncate">
            {project.createdBy.name}
          </span>
        </div>
      </div>

      {/* Footer with dates */}
      <div className="bg-gray-50 px-4 py-2 text-xs text-gray-500 flex items-center justify-between">
        <div className="flex items-center">
          <Calendar size={12} className="mr-1" />
          <span>{formatDate(project.createdAt)}</span>
        </div>

        {project.updatedAt !== project.createdAt && (
          <div className="flex items-center">
            <Info size={12} className="mr-1" />
            <span>Updated {formatDate(project.updatedAt)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
