import React, { useEffect, useState } from "react";
import { useToast } from "../../hooks/useToast";
import { motion } from "framer-motion";
import { SubmitHandler, useForm } from "react-hook-form";
import { TaskDTO, TaskResponseDTO } from "../../models/dtos/Task";
import FormInputField from "../atoms/FormInputField";
import TextAreaField from "../atoms/TextAreaField";
import { useTaskModal } from "../../hooks/useTaskModal";
import FormDropdown from "../atoms/FormDropdown";
import { useProject } from "../../hooks/useProject";
import { cn } from "../../utils/tailwindMerge";
import { Calendar, Check, Flag, UserCircle, X } from "lucide-react";
import { TaskService } from "../../services/TaskService";
import { CommentService } from "../../services/CommentService";
import { CommentResponseDTO } from "../../models/dtos/Comment";
import CommentsSection from "../organisms/CommentSection";
import { formatDateAndTime } from "../../utils/dateUtils";

interface ButtonProps {
  icon?: React.ReactNode;
  text: string;
  onClick?: () => void;
  bg?: "no-bg";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  icon,
  text,
  onClick,
  bg,
  type = "button",
  disabled = false,
  className,
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        "flex gap-1 items-center justify-center  px-4 py-2",
        bg == "no-bg"
          ? "hover:bg-gray-200 text-primary"
          : "bg-primary hover:bg-[#0055bb] text-white",
        disabled && "opacity-50 cursor-not-allowed ",
        className
      )}
      onClick={onClick}
    >
      {icon && <span className="flex items-center">{icon}</span>}
      <span className="flex items-center leading-none">{text}</span>
    </button>
  );
};

interface TaskModalProps {
  closeModal: (wasChanged: boolean) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ closeModal }) => {
  const [activeTab, setActiveTab] = useState("details");

  const priorityOptions = {
    low: "Low",
    medium: "Medium",
    high: "High",
    critical: "Critical",
  };

  const statusOptions = {
    todo: "To Do",
    "in-progress": "In Progress",
    completed: "Completed",
  };

  const { showToast } = useToast();
  const { project, projectMember } = useProject();
  const { modalMode, taskId, status } = useTaskModal();

  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [taskData, setTaskData] = useState<TaskResponseDTO | null>(null);

  const [editableData, setEditableData] = useState<TaskDTO | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // State to track if the task was changed and updated
  const [madeChanges, setMadeChanges] = useState(false);

  const [comments, setComments] = useState<CommentResponseDTO[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
    watch,
  } = useForm<TaskDTO>({
    mode: "onChange",
  });

  const formValues = watch();

  useEffect(() => {
    if (editableData && modalMode === "display") {
      const normalizeData = (data: TaskDTO) => ({
        ...data,
        assignedTo: data.assignedTo || "", // Ensure consistent default
        dueDate: data.dueDate ? data.dueDate.split("T")[0] : "", // Normalize date format
      });

      const isChanged =
        JSON.stringify(normalizeData(editableData)) !==
        JSON.stringify(normalizeData(formValues));

      setHasChanges(isChanged);
    }
  }, [formValues, editableData, modalMode]);

  const handleTaskSubmit: SubmitHandler<TaskDTO> = async (data) => {
    setIsCreatingTask(true);
    try {
      if (modalMode === "add") {
        console.log("Creating task:", data);
        await TaskService.createTask(data, project!.id);
        showToast("Task created successfully", { type: "success" });
        reset();
        closeModal(true);
      } else if (modalMode === "display" && hasChanges) {
        console.log("Updating task:", data);
        await TaskService.updateTask(taskId!, data, project!.id);
        showToast("Task updated successfully", { type: "success" });
        getTask();
        setEditableData(data);
        setHasChanges(false);
        setMadeChanges(true);
      }
    } catch (error) {
      console.error(
        `Error ${modalMode === "add" ? "creating" : "updating"} task:`,
        error
      );
      showToast(`Error ${modalMode === "add" ? "creating" : "updating"} task`, {
        type: "error",
      });
    } finally {
      setIsCreatingTask(false);
    }
  };

  const handleTaskDelete = async () => {
    setIsCreatingTask(true);
    try {
      console.log("Deleting task:", taskId);
      await TaskService.deleteTask(taskId!, project!.id);
      showToast("Task deleted successfully", { type: "success" });
      closeModal(true);
    } catch (error) {
      console.error("Error deleting task:", error);
      showToast("Error deleting task", { type: "error" });
    } finally {
      setIsCreatingTask(false);
    }
  };

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const commentsRes = await CommentService.getAllComments(
        project!.id,
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

  const getTask = async () => {
    setIsLoading(true);
    try {
      const task = await TaskService.getTask(taskId!, project!.id);
      console.log("Task data:", task);
      setTaskData(task);

      // Create a consistent object structure for comparison
      const editableTaskData: TaskDTO = {
        title: task.title,
        description: task.description,
        assignedTo: task.assignedTo?.id || "",
        dueDate: task.dueDate,
        priority: task.priority,
        status: task.status,
      };

      // Set form values
      setValue("title", editableTaskData.title);
      setValue("description", editableTaskData.description);
      setValue("assignedTo", editableTaskData.assignedTo);
      setValue("dueDate", editableTaskData.dueDate?.split("T")[0] ?? "");
      setValue("priority", editableTaskData.priority);
      setValue("status", editableTaskData.status);

      setEditableData(editableTaskData);
    } catch (error) {
      console.error("Error fetching task:", error);
      showToast("Error loading task details", { type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (modalMode === "display") {
      getTask();
      fetchComments();
    } else if (modalMode === "add") {
      setValue("status", status ?? "todo");
    }
  }, [modalMode]);

  // Create a memberOptions object for the assignee dropdown
  const memberOptions = project?.projectMembers.reduce(
    (acc, member) => {
      acc[member.id] = member.name;
      return acc;
    },
    { "": "Unassigned" } as Record<string, string>
  ) || { "": "Unassigned" };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          closeModal(madeChanges);
        }
      }}
    >
      <motion.div
        className="bg-white rounded-lg shadow-xl w-[1000px] h-[600px] relative z-50 flex flex-col overflow-hidden pb-20"
        initial={{ y: 20, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 20, opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <div className="p-6 pb-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {modalMode === "add"
                  ? "Create New Task"
                  : `${project?.key} - ${taskData?.taskNumber}`}
              </h2>
              <p className="text-gray-500 text-sm">
                {modalMode === "add"
                  ? "Add a new task to your project"
                  : `Last updated by ${
                      taskData?.updatedBy.name
                    } on ${formatDateAndTime(taskData?.updatedAt!)}`}
              </p>
            </div>
            <Button
              icon={<X size={24} className="text-gray-500" />}
              text=""
              bg="no-bg"
              onClick={() => closeModal(false)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            />
          </div>

          {/* Tabs */}
          {modalMode === "display" && (
            <div className="flex border-b">
              <Button
                text="Details"
                bg="no-bg"
                onClick={() => setActiveTab("details")}
                className={`px-6 py-3 font-medium ${
                  activeTab === "details"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              />
              <Button
                text={`Comments ${
                  comments?.length > 0 ? `(${comments.length})` : ""
                }`}
                bg="no-bg"
                onClick={() => setActiveTab("comments")}
                className={`px-6 py-3 font-medium flex items-center gap-2 ${
                  activeTab === "comments"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              />
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-500">Loading task information...</p>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(handleTaskSubmit)}
            className="flex-1 overflow-auto"
          >
            <div
              className={`p-6 ${activeTab === "details" ? "block" : "hidden"}`}
            >
              <div className="grid grid-cols-3 gap-6">
                {/* Left column - Main task information */}
                <div className="col-span-2">
                  <div className="mb-6">
                    <FormInputField
                      label="Task Title"
                      id="title"
                      register={register}
                      error={errors.title?.message}
                      validation={{ required: "Task title is required" }}
                      placeholder="Enter a descriptive task title"
                      className="w-full p-3"
                      disabled={projectMember?.role === "viewer"}
                    />
                  </div>

                  <div className="mb-6">
                    <TextAreaField
                      label="Description"
                      id="description"
                      register={register}
                      placeholder="Provide detailed information about this task"
                      rows={6}
                      className="w-full p-3"
                      disabled={projectMember?.role === "viewer"}
                      helperText="Optional: Add details, requirements, or context"
                    />
                  </div>
                </div>

                {/* Right column - Task settings and metadata */}
                <div className="col-span-1">
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">
                      Task Settings
                    </h3>

                    {/* Assigned To */}
                    <div className="mb-4">
                      <div className="flex items-center mb-1">
                        <UserCircle size={16} className="text-gray-400 mr-2" />
                        <label
                          className="text-sm text-gray-600"
                          htmlFor="assignedTo"
                        >
                          Assigned To
                        </label>
                      </div>
                      <FormDropdown
                        label=""
                        id="assignedTo"
                        options={memberOptions}
                        register={register}
                        disabled={projectMember?.role === "viewer"}
                        className="w-full p-2"
                      />
                    </div>

                    {/* Due Date */}
                    <div className="mb-4">
                      <div className="flex items-center mb-1">
                        <Calendar size={16} className="text-gray-400 mr-2" />
                        <label
                          className="text-sm text-gray-600"
                          htmlFor="dueDate"
                        >
                          Due Date
                        </label>
                      </div>
                      <FormInputField
                        label=""
                        id="dueDate"
                        type="date"
                        register={register}
                        className="w-full p-2"
                        disabled={projectMember?.role === "viewer"}
                      />
                    </div>

                    {/* Priority */}
                    <div className="mb-4">
                      <div className="flex items-center mb-1">
                        <Flag size={16} className="text-gray-400 mr-2" />
                        <label
                          className="text-sm text-gray-600"
                          htmlFor="priority"
                        >
                          Priority
                        </label>
                      </div>
                      <FormDropdown
                        label=""
                        id="priority"
                        options={priorityOptions}
                        register={register}
                        validation={{ required: "Priority is required" }}
                        error={errors.priority?.message}
                        disabled={projectMember?.role === "viewer"}
                        className="w-full p-2"
                      />
                    </div>

                    {/* Status */}
                    <div>
                      <div className="flex items-center mb-1">
                        <div className="w-4 h-4 rounded-full bg-gray-300 mr-2"></div>
                        <label
                          className="text-sm text-gray-600"
                          htmlFor="status"
                        >
                          Status
                        </label>
                      </div>
                      <FormDropdown
                        label=""
                        id="status"
                        options={statusOptions}
                        register={register}
                        validation={{ required: "Status is required" }}
                        error={errors.status?.message}
                        disabled={projectMember?.role === "viewer"}
                        className="w-full p-2"
                      />
                    </div>
                  </div>

                  {modalMode === "display" && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-3">
                        Task Information
                      </h3>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500">Task #:</span>
                          <span className="font-medium">
                            {taskData?.taskNumber}
                          </span>
                        </div>

                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500">Created by:</span>
                          <span className="font-medium">
                            {taskData?.createdBy.name}
                          </span>
                        </div>

                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500">Created on:</span>
                          <span className="font-medium">
                            {formatDateAndTime(taskData?.createdAt!)}
                          </span>
                        </div>

                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500">Last updated:</span>
                          <span className="font-medium">
                            {formatDateAndTime(taskData?.updatedAt!)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Comments Tab */}
            {activeTab === "comments" && (
              <div className="p-6">
                <CommentsSection
                  comments={comments}
                  fetchComments={fetchComments}
                />
              </div>
            )}

            {/* Footer with Action Buttons */}
            <div className="border-t px-6 py-4 bg-gray-50 flex items-center justify-between absolute bottom-0 w-full">
              <div className="flex items-center gap-2">
                {modalMode === "display" && hasChanges && (
                  <span className="text-xs text-orange-500 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                    Unsaved changes
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {(projectMember?.role === "owner" ||
                  projectMember?.role === "editor") &&
                  modalMode === "display" && (
                    <Button
                      icon={<X size={18} />}
                      text="Delete Task"
                      onClick={handleTaskDelete}
                      className="border border-red-200 text-red-600 font-medium rounded-md hover:bg-red-50 transition-colors"
                      bg="no-bg"
                    />
                  )}

                <Button
                  text="Cancel"
                  onClick={() => closeModal(madeChanges)}
                  className="border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
                  bg="no-bg"
                />

                {modalMode === "add" && (
                  <Button
                    icon={<Check size={18} />}
                    text="Create Task"
                    type="submit"
                    disabled={isCreatingTask}
                    className="bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                )}

                {modalMode === "display" &&
                  projectMember?.role !== "viewer" && (
                    <Button
                      icon={<Check size={18} />}
                      text="Save Changes"
                      type="submit"
                      disabled={isCreatingTask || !hasChanges}
                    />
                  )}
              </div>
            </div>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
};

export default TaskModal;
