import { NullTime } from "./nullTime";
import { ProjectMemberResponseDTO } from "./projectMember";

export enum TaskPriority {
  low = "low",
  medium = "medium",
  high = "high",
  critical = "critical",
}

export interface CreateTaskDTO {
  assignedTo?: string;
  title: string;
  description?: string;
  status: string;
  priority: TaskPriority;
  dueDate: NullTime;
}

export interface TaskResponseDTO {
  id: string;
  projectId: string;
  createdBy: ProjectMemberResponseDTO;
  UpdatedBy: ProjectMemberResponseDTO;
  AssignedTo?: ProjectMemberResponseDTO;
  title: string;
  taskNumber: string;
  description?: string;
  status: string;
  priority: TaskPriority;
  dueDate: NullTime;
}
