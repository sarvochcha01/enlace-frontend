import axios from "axios";
import { CommentDTO } from "../models/dtos/comment";
import { baseUrl } from "../utils/utils";
import { getIdToken } from "../singletons/Auth";

export class CommentService {
  static createComment = async (commentDTO: CommentDTO) => {
    const token = await getIdToken();
    if (!token) {
      throw new Error("No authentication token available. Please log in.");
    }

    const res = await axios.post(
      `${baseUrl}/projects/${commentDTO.projectId}/tasks/${commentDTO.taskId}/comments`,
      {
        comment: commentDTO.comment,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(res);
  };

  static getAllComments = async (projectId: string, taskId: string) => {
    const token = await getIdToken();
    if (!token) {
      throw new Error("No authentication token available. Please log in.");
    }

    const res = await axios.get(
      `${baseUrl}/projects/${projectId}/tasks/${taskId}/comments`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };

  static updateComment = async (commentId: string, commentDTO: CommentDTO) => {
    const token = await getIdToken();
    if (!token) {
      throw new Error("No authentication token available. Please log in.");
    }

    const res = await axios.put(
      `${baseUrl}/projects/${commentDTO.projectId}/tasks/${commentDTO.taskId}/comments/${commentId}`,
      {
        comment: commentDTO.comment,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(res);
  };

  static deleteComment = async (
    projectId: string,
    taskId: string,
    commentId: string
  ) => {
    const token = await getIdToken();
    if (!token) {
      throw new Error("No authentication token available. Please log in.");
    }

    const res = await axios.delete(
      `${baseUrl}/projects/${projectId}/tasks/${taskId}/comments/${commentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(res);
  };
}
