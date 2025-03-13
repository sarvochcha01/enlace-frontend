import React, { createContext, useEffect, useState } from "react";
import { ProjectResponseDTO } from "../models/dtos/Project";
import { ProjectMemberResponseDTO } from "../models/dtos/ProjectMember";
import { ProjectService } from "../services/ProjectService";
import { useUser } from "../hooks/useUser";

export interface ProjectContextType {
  project: ProjectResponseDTO | null;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  setProject: (project: ProjectResponseDTO | null) => void;

  refetchProject: () => Promise<void>;

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
   */
  getProjectMemberData: (id: string) => ProjectMemberResponseDTO | null; // Get project member data by ID
}

export const ProjectContext = createContext<ProjectContextType | null>(null);

export const ProjectProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [project, setProject] = useState<ProjectResponseDTO | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [projectMember, setProjectMember] =
    useState<ProjectMemberResponseDTO | null>(null); // Which project member is the current user

  const [projectMembers, setProjectMembers] = useState<
    ProjectMemberResponseDTO[] | null
  >(null); // All project members

  const { dbUser } = useUser();

  const refetchProject = async () => {
    if (!project || !project.id) return;

    setIsLoading(true);
    try {
      const projectRes = await ProjectService.getProject(project.id);
      // const projectMemberRes = await ProjectMemberService.getProjectMember(
      //   projectId
      // );

      console.log(projectRes);

      setProjectMembers(projectRes.projectMembers || []);
      setProjectMember(
        projectRes.projectMembers.find(
          (member) => member.userId === dbUser?.id
        ) || null
      );
      setProject(projectRes);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

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
    <ProjectContext.Provider
      value={{
        projectMember,
        isLoading,
        setIsLoading,
        setProjectMember,
        projectMembers,
        setProjectMembers,
        getProjectMemberData,
        project,
        setProject,
        refetchProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
