export interface CommentDTO {
  projectId: string;
  taskId: string;
  comment: string;
}

export interface CommentResponseDTO {
  comment: string;
  createdAt: string;
  createdBy: string;
  id: string;
  projectId: string;
  taskId: string;
  updatedAt: string;
}
