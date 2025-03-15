export type InvitationStatus = "pending" | "accepted" | "declined";

export interface InvitationResponseDTO {
  id: string;
  invitedBy: string;
  invitedUserId: string;
  projectId: string;
  projectName: string;
  status: InvitationStatus;
  invitedAt: string;
  name: string;
  email: string;
}
