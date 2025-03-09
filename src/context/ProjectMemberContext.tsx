import { createContext, useState } from "react";
import { ProjectMemberResponseDTO } from "../models/dtos/projectMember";

export interface ProjectMemberContextType {
  /**
   * The current user's project member data.
   * This represents the project member associated with the currently logged-in user.
   * If the user is not a project member or the data is unavailable, this will be `null`.
   */
  projectMember: ProjectMemberResponseDTO | null; // Current user's project member data
  setProjectMember: (projectMember: ProjectMemberResponseDTO | null) => void;
  projectMembers: ProjectMemberResponseDTO[] | null;
  setProjectMembers: (
    projectMembers: ProjectMemberResponseDTO[] | null
  ) => void;

  /**
   * Retrieves project member data by the given member ID.
   * Returns the project member data if found, or `null` if no member with the provided ID exists.
   *
   */
  getProjectMemberData: (id: string) => ProjectMemberResponseDTO | null; // Get project member data by ID
}

export const ProjectMemberContext = createContext<
  ProjectMemberContextType | undefined
>(undefined);

export const ProjectMemberProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [projectMember, setProjectMember] =
    useState<ProjectMemberResponseDTO | null>(null); // Which project member is the current user

  const [projectMembers, setProjectMembers] = useState<
    ProjectMemberResponseDTO[] | null
  >(null); // All project members

  const getProjectMemberData = (
    id: string
  ): ProjectMemberResponseDTO | null => {
    if (!projectMembers) {
      return null;
    }

    return (
      projectMembers.find((projectMember) => projectMember.id === id) || null
    );
  };

  return (
    <ProjectMemberContext.Provider
      value={{
        projectMember,
        setProjectMember,
        projectMembers,
        setProjectMembers,
        getProjectMemberData,
      }}
    >
      {children}
    </ProjectMemberContext.Provider>
  );
};
