import { ProjectMemberResponseDTO } from "./ProjectMember";
import { TaskResponseDTO } from "./Task";
import { User } from "./User";

export interface ProjectResponseDTO {
  id: string;
  name: string;
  description: string;
  key: string;
  createdBy: User;
  projectMembers: ProjectMemberResponseDTO[];
  tasks: TaskResponseDTO[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectDTO {
  name: string;
  description: string;
  key: string;
}

export interface UpdateProjectDTO {
  name: string;
  description: string;
}
