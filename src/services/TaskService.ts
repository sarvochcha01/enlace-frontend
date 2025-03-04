import axios from "axios";
import { CreateTaskDTO, TaskResponseDTO } from "../models/task";
import { baseUrl } from "../utils/utils";
import { getIdToken } from "../singletons/Auth";
import { NullTime } from "../models/NullTime";

export class TaskService {
  static createTask = async (
    task: CreateTaskDTO,
    projectId: string
  ): Promise<void> => {
    const token = await getIdToken();

    if (!token) {
      throw new Error("No authentication token available. Please log in.");
    }

    const requestBody = {
      ...task,
      assignedTo: task.assignedTo ? task.assignedTo : null,
    };

    console.log("Creating task:", requestBody);

    const res = await axios.post(
      `${baseUrl}/projects/${projectId}/tasks`,
      requestBody,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    console.log(res.data);
    return res.data;
  };

  static getTask = async (
    taskId: string,
    projectId: string
  ): Promise<TaskResponseDTO> => {
    const token = await getIdToken();

    if (!token) {
      throw new Error("No authentication token available. Please log in.");
    }
    const res = await axios.get(
      `${baseUrl}/projects/${projectId}/tasks/${taskId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    console.log(res.data);
    return res.data;
  };

  static updateTask = async (
    taskId: string,
    task: CreateTaskDTO,
    projectId: string
  ): Promise<void> => {
    const token = await getIdToken();

    if (!token) {
      throw new Error("No authentication token available. Please log in.");
    }

    const requestBody = {
      ...task,
      assignedTo: task.assignedTo ? task.assignedTo : null,
    };

    console.log("Updating task:", requestBody);

    const res = await axios.put(
      `${baseUrl}/projects/${projectId}/tasks/${taskId}`,
      requestBody,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    console.log(res.data);
    return res.data;
  };
}
