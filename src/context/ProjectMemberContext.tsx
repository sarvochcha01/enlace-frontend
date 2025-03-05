import { createContext, useState } from "react";

export interface ProjectMemberContextType {
  projectMemberId: string | null;
  setProjectMemberId: (id: string) => void;
}

export const ProjectMemberContext = createContext<
  ProjectMemberContextType | undefined
>(undefined);

export const ProjectMemberProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [projectMemberId, setProjectMemberId] = useState<string | null>(null);

  return (
    <ProjectMemberContext.Provider
      value={{ projectMemberId, setProjectMemberId }}
    >
      {children}
    </ProjectMemberContext.Provider>
  );
};
