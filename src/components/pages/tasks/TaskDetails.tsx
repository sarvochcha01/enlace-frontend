import { useParams } from "react-router-dom";
import { useProject } from "../../../hooks/useProject";
import { useToast } from "../../../hooks/useToast";
import { useEffect, useState } from "react";
import { TaskResponseDTO } from "../../../models/dtos/Task";
import { CommentResponseDTO } from "../../../models/dtos/Comment";
import { TaskService } from "../../../services/TaskService";
import { CommentService } from "../../../services/CommentService";
import { formatDateAndTime } from "../../../utils/dateUtils";
import CommentsSection from "../../organisms/CommentSection";

const TaskDetails = () => {
  const { showToast } = useToast();
  const { project } = useProject();
  const { projectId, taskId } = useParams();

  const [taskData, setTaskData] = useState<TaskResponseDTO | null>(null);
  const [comments, setComments] = useState<CommentResponseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const task = await TaskService.getTask(taskId!, projectId!);
        setTaskData(task);
      } catch (error) {
        console.error("Error fetching task details:", error);
        showToast("Error loading task details", { type: "error" });
      }
    };

    const fetchComments = async () => {
      try {
        const commentsRes = await CommentService.getAllComments(
          projectId!,
          taskId!
        );
        setComments(commentsRes);
      } catch (error) {
        console.error("Error fetching comments:", error);
        showToast("Failed to load comments", { type: "error" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTaskDetails();
    fetchComments();
  }, [taskId, projectId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!taskData) {
    return <div>Task not found.</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{taskData.title}</h1>
      <p className="text-gray-700 mb-2">{taskData.description}</p>
      <div className="bg-gray-100 p-4 rounded-md">
        <p>
          <strong>Assigned To:</strong>{" "}
          {taskData.assignedTo?.name || "Unassigned"}
        </p>
        <p>
          <strong>Priority:</strong> {taskData.priority}
        </p>
        <p>
          <strong>Status:</strong> {taskData.status}
        </p>
        <p>
          <strong>Due Date:</strong>{" "}
          {taskData.dueDate ? formatDateAndTime(taskData.dueDate) : "N/A"}
        </p>
        <p>
          <strong>Created By:</strong> {taskData.createdBy.name}
        </p>
        <p>
          <strong>Created At:</strong> {formatDateAndTime(taskData.createdAt)}
        </p>
        <p>
          <strong>Updated By:</strong> {taskData.updatedBy.name}
        </p>
        <p>
          <strong>Updated At:</strong> {formatDateAndTime(taskData.updatedAt)}
        </p>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold">Comments</h2>
        <CommentsSection comments={comments} fetchComments={() => {}} />
      </div>
    </div>
  );
};

export default TaskDetails;
