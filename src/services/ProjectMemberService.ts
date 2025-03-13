import axios from "axios";

import { baseUrl } from "../utils/utils";
import { getIdToken } from "../singletons/Auth";

export class ProjectMemberService {
  static getProjectMember = async (projectID: string) => {
    const token = await getIdToken();

    if (!token) {
      throw new Error("No authentication token available. Please log in.");
    }

    const res = await axios.get(
      `${baseUrl}/projects/${projectID}/project-member`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };

  static updateProjectMember = async (
    projectID: string,
    projectMemberID: string,
    newRole: string
  ) => {
    const token = await getIdToken();
    console.log(projectID, projectMemberID, newRole);

    if (!token) {
      throw new Error("No authentication token available. Please log in.");
    }

    const res = await axios.put(
      `${baseUrl}/projects/${projectID}/project-members/${projectMemberID}`,
      { role: newRole },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };
}
