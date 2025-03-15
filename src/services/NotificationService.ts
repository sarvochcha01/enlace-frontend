import axios from "axios";
import { getIdToken } from "../singletons/Auth";
import { baseUrl } from "../utils/utils";
import { InvitationResponseDTO } from "../models/dtos/Invitation";

// We are currently only fetching the invitations, will add more functionality later
export class NotificationService {
  static GetAllNotifications = async (): Promise<InvitationResponseDTO[]> => {
    const token = getIdToken();

    if (!token) {
      throw new Error("No authentication token available. Please log in.");
    }

    try {
      const res = await axios.get(`${baseUrl}/invitations`, {
        headers: { Authorization: `Bearer ${await token}` },
      });

      return res.data;
    } catch (error) {
      throw new Error("Error fetching notifications");
    }
  };

  static RespondToInvitation = async (
    invitationId: string,
    projectId: string,
    status: "accepted" | "declined"
  ) => {
    const token = getIdToken();

    if (!token) {
      throw new Error("No authentication token available. Please log in.");
    }

    try {
      const res = await axios.put(
        `${baseUrl}/invitations/${invitationId}`,
        { status, projectId },
        {
          headers: { Authorization: `Bearer ${await token}` },
        }
      );
      console.log(res);
      return res.data;
    } catch (error) {
      throw new Error("Error responding to invitation");
    }
  };
}
