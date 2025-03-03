import React, { createContext, useEffect, useState } from "react";
import { ProjectResponseDTO } from "../models/project";

export interface ProjectContextType {
  project: ProjectResponseDTO | null;
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

  return (
    <ProjectContext.Provider value={{ project, setProject }}>
      {children}
    </ProjectContext.Provider>
  );
};
