import axios from "axios";
import { CreateProjectDTO, ProjectResponseDTO } from "../models/project";

import { baseUrl } from "../utils/utils";

import { getIdToken } from "../singletons/Auth";

export class ProjectService {
  static getProject = async (
    projectID: string
  ): Promise<ProjectResponseDTO> => {
    const token = await getIdToken();

    if (!token) {
      throw new Error("No authentication token available. Please log in.");
    }

    const res = await axios.get(`${baseUrl}/projects/${projectID}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  };

  static getProjects = async (): Promise<ProjectResponseDTO[]> => {
    const token = await getIdToken();

    if (!token) {
      throw new Error("No authentication token available. Please log in.");
    }

    const res = await axios.get(`${baseUrl}/projects`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  };

  static createProject = async (
    project: CreateProjectDTO
  ): Promise<ProjectResponseDTO> => {
    const token = await getIdToken();

    if (!token) {
      throw new Error("No authentication token available. Please log in.");
    }

    const payload = {
      name: project.name,
      description: project.description,
      key: project.key,
    };

    const res = await axios.post(`${baseUrl}/projects`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(res.data);
    return res.data;
  };
}
