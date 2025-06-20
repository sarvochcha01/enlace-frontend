import axios from "axios";
import { baseUrl } from "../utils/utils";
import { getIdToken } from "../singletons/Auth";

export class InvitationService {
  static async InviteUserToProject(
    projectId: string,
    userId: string
  ): Promise<any> {
    const token = getIdToken();

    if (!token) {
      throw new Error("No authentication token available. Please log in.");
    }

    const payload = {
      invitedUserId: userId,
      projectId,
    };

    try {
      const res = await axios.post(`${baseUrl}/invitations`, payload, {
        headers: { Authorization: `Bearer ${await token}` },
      });

      if (!res || res.status !== 201) {
        throw new Error("Backend project invitation failed");
      }

      console.log(res?.data);
      return res?.data;
    } catch (backendError) {
      throw backendError;
    }
  }

  static async IsInvitedToProject(projectId: string): Promise<any> {
    const token = await getIdToken();
    if (!token) {
      throw new Error("No authentication token available. Please log in.");
    }
    try {
      const res = await axios.get(
        `${baseUrl}/invitations/join-project/${projectId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res || res.status !== 200) {
        throw new Error("Backend project invitation failed");
      }

      return res?.data;
    } catch (backendError) {
      throw backendError;
    }
  }

  static async UpdateInvitationStatus(
    invitationId: string,
    projectId: string,
    status: "accepted" | "declined"
  ): Promise<any> {
    const token = await getIdToken();
    if (!token) {
      throw new Error("No authentication token available. Please log in.");
    }
    try {
      const res = await axios.put(
        `${baseUrl}/invitations/${invitationId}`,
        {
          id: invitationId,
          projectId,
          status: "declined",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res || res.status !== 200) {
        throw new Error("Backend project invitation failed");
      }

      return res?.data;
    } catch (backendError) {
      throw backendError;
    }
  }
}
