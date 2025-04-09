import { InvitationResponseDTO } from "./Invitation";
import { ProjectMemberResponseDTO } from "./ProjectMember";
import { TaskResponseDTO } from "./Task";
import { User } from "./User";

export interface ProjectResponseDTO {
  id: string;
  name: string;
  description: string;
  key: string;
  createdBy: User;
  invitations: InvitationResponseDTO[];
  projectMembers: ProjectMemberResponseDTO[];
  tasks: TaskResponseDTO[];
  tasksCompleted: number;
  totalTasks: number;
  activeTasksAssignedToUserCount: number;
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
