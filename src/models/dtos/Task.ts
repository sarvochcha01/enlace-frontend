import { ProjectMemberResponseDTO } from "./ProjectMember";

export enum TaskPriority {
  low = "low",
  medium = "medium",
  high = "high",
  critical = "critical",
}

export interface TaskDTO {
  assignedTo: string | null;
  title: string;
  description?: string;
  status: string;
  priority: TaskPriority;
  dueDate: string | null;
}

export interface TaskResponseDTO {
  id: string;
  projectId: string;
  projectKey: string;
  projectName: string;
  createdBy: ProjectMemberResponseDTO;
  updatedBy: ProjectMemberResponseDTO;
  assignedTo?: ProjectMemberResponseDTO;
  assignedToName?: string;
  title: string;
  taskNumber: number;
  description: string;
  status: string;
  priority: TaskPriority;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}
