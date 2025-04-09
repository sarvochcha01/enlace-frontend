export interface Notification {
  id: string;
  userId: string;
  projectId?: string;
  taskId?: string;
  invitationId: string;
  type: "task_assigned" | "project_invitation" | "comment_added";
  content: string;
  status: "read" | "unread";
  createdAt: string;
}
