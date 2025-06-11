import axios from "axios";
import {
  CreateProjectDTO,
  ProjectResponseDTO,
  UpdateProjectDTO,
} from "../models/dtos/Project";

import { baseUrl } from "../utils/utils";

import { getIdToken } from "../singletons/Auth";
import { validate } from "uuid";

export class ProjectService {
  static getProject = async (
    projectID: string
  ): Promise<ProjectResponseDTO> => {
    if (!validate(projectID)) {
      throw new Error("Invalid project ID");
    }

    const token = await getIdToken();

    if (!token) {
      throw new Error("No authentication token available. Please log in.");
    }

    try {
      const res = await axios.get(`${baseUrl}/projects/${projectID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    } catch (error) {
      throw error;
    }
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

  static getProjectName = async (projectId: string): Promise<any> => {
    const token = await getIdToken();

    if (!token) {
      throw new Error("No authentication token available. Please log in.");
    }

    const res = await axios.get(`${baseUrl}/projects/${projectId}/join`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(res.data);
    return res.data;
  };

  static updateProject = async (
    projectId: string,
    project: UpdateProjectDTO
  ): Promise<void> => {
    const token = await getIdToken();

    if (!token) {
      throw new Error("No authentication token available. Please log in.");
    }

    const payload = {
      name: project.name,
      description: project.description,
    };

    const res = await axios.put(`${baseUrl}/projects/${projectId}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  };

  static deleteProject = async (projectId: string): Promise<void> => {
    const token = await getIdToken();

    if (!token) {
      throw new Error("No authentication token available. Please log in.");
    }

    const res = await axios.delete(`${baseUrl}/projects/${projectId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(res.data);
    return res.data;
  };

  static leaveProject = async (projectId: string): Promise<any> => {
    const token = await getIdToken();

    if (!token) {
      throw new Error("No authentication token available. Please log in.");
    }

    const res = await axios.post(
      `${baseUrl}/projects/${projectId}/leave`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(res.data);
    return res.data;
  };
}
