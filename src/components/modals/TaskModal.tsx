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
import ButtonWithIcon from "../atoms/ButtonWithIcon";
import { Check, X } from "lucide-react";
import { TaskService } from "../../services/TaskService";
import { CommentService } from "../../services/CommentService";
import { CommentResponseDTO } from "../../models/dtos/Comment";
import CommentsSection from "../organisms/CommentSection";
import { formatDateAndTime } from "../../utils/dateUtils";

interface TaskModalProps {
  closeModal: () => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ closeModal }) => {
  const { showToast } = useToast();
  const { project, projectMember } = useProject();
  const { modalMode, taskId, status } = useTaskModal();

  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [taskData, setTaskData] = useState<TaskResponseDTO | null>(null);

  const [editableData, setEditableData] = useState<TaskDTO | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

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
      } else if (modalMode === "display" && hasChanges) {
        console.log("Updating task:", data);
        await TaskService.updateTask(taskId!, data, project!.id);
        showToast("Task updated successfully", { type: "success" });
        setEditableData(data);
      }
      reset();
      closeModal();
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
      closeModal();
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

  return (
    <motion.div
      className="fixed inset-0 z-10 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      <div
        className="fixed inset-0 bg-black bg-opacity-50 "
        onClick={closeModal}
      ></div>

      <motion.div
        className="bg-white  p-6 w-[1200px] h-[650px] relative z-50 flex flex-col rounded-xl "
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.15 }}
      >
        <div className="overflow-auto flex-1 pr-4 -mr-4">
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <div className="flex flex-col">
              <form onSubmit={handleSubmit(handleTaskSubmit)}>
                <div className="text-center w-full mb-2 ">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {modalMode === "add" ? "Create Task" : "Task Details"}
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    {modalMode === "add"
                      ? "Fill in the details to create a new task"
                      : "View and edit task details"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <div className="w-2/3 flex flex-col gap-4 ">
                    <FormInputField
                      label="Task Title"
                      id="title"
                      placeholder="Enter task title"
                      error={errors.title?.message}
                      register={register}
                      validation={{
                        required: "Task title is required",
                      }}
                      className="w-full"
                    />
                    <TextAreaField
                      label="Description"
                      id="description"
                      placeholder="Enter task description"
                      error={errors.description?.message}
                      register={register}
                      helperText="Optional: Add a description to the task"
                    />
                  </div>
                  <div className="flex flex-col gap-4 w-1/3">
                    <div className=" flex flex-col gap-4 border border-gray-400 p-2 rounded">
                      <FormDropdown
                        label="Assigned To"
                        options={{
                          "": "Unassigned",
                          ...Object.fromEntries(
                            project!.projectMembers.map((member) => [
                              member.id,
                              member.name,
                            ])
                          ),
                        }}
                        id="assignedTo"
                        error={errors.assignedTo?.message}
                        register={register}
                        flexDir="row"
                      />
                      <FormInputField
                        label="Due Date"
                        id="dueDate"
                        type="date"
                        error={errors.dueDate?.message}
                        register={register}
                        flexDir="row"
                      />

                      <FormDropdown
                        label="Priority"
                        options={{
                          low: "Low",
                          medium: "Medium",
                          high: "High",
                          critical: "Critical",
                        }}
                        id="priority"
                        error={errors.priority?.message}
                        register={register}
                        validation={{
                          required: "Priority is required",
                        }}
                        flexDir="row"
                      />

                      <FormDropdown
                        label="Status"
                        options={{
                          todo: "To Do",
                          "in-progress": "In Progress",
                          completed: "Completed",
                        }}
                        id="status"
                        error={errors.status?.message}
                        register={register}
                        validation={{
                          required: "Status is required",
                        }}
                        flexDir="row"
                      />
                    </div>
                    {modalMode === "display" && (
                      <div className="flex flex-col">
                        <div className="flex w-full justify-between">
                          <div className="text-sm text-gray-500">
                            Task Number
                          </div>
                          <div className="text-lg font-bold text-gray-800">
                            {taskData?.taskNumber}
                          </div>
                        </div>

                        <div className="flex w-full justify-between">
                          <div className="text-sm text-gray-500">
                            Created By
                          </div>
                          <div className="text-lg font-bold text-gray-800">
                            {taskData?.createdBy.name}
                          </div>
                        </div>

                        <div className="flex w-full justify-between">
                          <div className="text-sm text-gray-500">
                            Created At
                          </div>
                          <div className="text-lg font-bold text-gray-800">
                            {formatDateAndTime(taskData?.createdAt!)}
                          </div>
                        </div>
                        <div className="flex w-full justify-between">
                          <div className="text-sm text-gray-500">
                            Updated By
                          </div>
                          <div className="text-lg font-bold text-gray-800">
                            {taskData?.updatedBy.name}
                          </div>
                        </div>

                        <div className="flex w-full justify-between">
                          <div className="text-sm text-gray-500">
                            Updated At
                          </div>
                          <div className="text-lg font-bold text-gray-800">
                            {formatDateAndTime(taskData?.updatedAt!)}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="w-full flex justify-center gap-6 mt-12">
                  <ButtonWithIcon
                    icon={<X size={20} />}
                    text="Close"
                    type="button"
                    onClick={closeModal}
                    bg="no-bg"
                    disabled={isCreatingTask}
                  />
                  {modalMode === "add" && (
                    <ButtonWithIcon
                      icon={<Check size={20} />}
                      text="Create Task"
                      type="submit"
                      disabled={isCreatingTask}
                    />
                  )}
                  {modalMode === "display" && (
                    <ButtonWithIcon
                      icon={<Check size={20} />}
                      text="Update Task"
                      type="submit"
                      disabled={isCreatingTask || !hasChanges}
                      // bg={hasChanges ? "default" : "gray"}
                    />
                  )}

                  {taskData?.createdBy.id === projectMember?.id && (
                    <ButtonWithIcon
                      icon={<Check size={20} />}
                      text="Delete Task"
                      type="button"
                      onClick={handleTaskDelete}
                    />
                  )}
                  {modalMode === "display" && hasChanges && (
                    <div className="text-xs text-red-500 absolute bottom-4 right-4">
                      * Unsaved changes
                    </div>
                  )}
                </div>
              </form>

              {/* TODO: Make a comment context */}
              <div className="flex flex-col mt-16 gap-4">
                <CommentsSection
                  comments={comments}
                  fetchComments={() => {
                    fetchComments();
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TaskModal;
