import { NullString } from "./NullString";
import { NullTime } from "./NullTime";
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
  updatedBy: ProjectMemberResponseDTO;
  assignedTo?: ProjectMemberResponseDTO;
  title: string;
  taskNumber: string;
  description: NullString;
  status: string;
  priority: TaskPriority;
  dueDate: NullTime;
}
