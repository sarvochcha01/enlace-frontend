import React, { createContext, useEffect, useState } from "react";
import { ProjectResponseDTO } from "../models/dtos/project";

export interface ProjectContextType {
  project: ProjectResponseDTO | null;
  projectId: string;
  setProject: (project: ProjectResponseDTO | null) => void;
}

export const ProjectContext = createContext<ProjectContextType | undefined>(
  undefined
);

export const ProjectProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [project, setProject] = useState<ProjectResponseDTO | null>(null);
  const [projectId, setProjectId] = useState<string>("");

  useEffect(() => {
    if (project) {
      setProjectId(project.id);
    }
  }, [project]);

  return (
    <ProjectContext.Provider value={{ project, projectId, setProject }}>
      {children}
    </ProjectContext.Provider>
  );
};
