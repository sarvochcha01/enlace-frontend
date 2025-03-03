import { ProjectMemberResponseDTO } from "./projectMember";
import { TaskResponseDTO } from "./task";
import { User } from "./user";

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
