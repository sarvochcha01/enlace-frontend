import React, { useEffect, useState } from "react";
import { useToast } from "../../hooks/useToast";
import { motion } from "framer-motion";
import { SubmitHandler, useForm } from "react-hook-form";
import { TaskDTO } from "../../models/task";
import InputField from "../atoms/InputField";
import TextAreaField from "../atoms/TextAreaField";
import { useTaskModal } from "../../hooks/useTaskModal";
import Dropdown from "../atoms/Dropdown";
import { useProject } from "../../hooks/useProject";
import ButtonWithIcon from "../atoms/ButtonWithIcon";
import { Check, X } from "lucide-react";
import { TaskService } from "../../services/TaskService";

interface CreateTaskModalProps {
  closeModal: () => void;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ closeModal }) => {
  const { showToast } = useToast();
  const { project } = useProject();
  const { modalMode, taskId } = useTaskModal();

  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [originalData, setOriginalData] = useState<TaskDTO | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

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
    if (originalData && modalMode === "display") {
      const normalizeData = (data: TaskDTO) => ({
        ...data,
        assignedTo: data.assignedTo || "", // Ensure consistent default
        dueDate: data.dueDate ? data.dueDate.split("T")[0] : "", // Normalize date format
      });

      const isChanged =
        JSON.stringify(normalizeData(originalData)) !==
        JSON.stringify(normalizeData(formValues));

      setHasChanges(isChanged);
    }
  }, [formValues, originalData, modalMode]);

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
        setOriginalData(data);
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

  const getTask = async () => {
    setIsLoading(true);
    try {
      const task = await TaskService.getTask(taskId!, project!.id);

      // Create a consistent object structure for comparison
      const taskData: TaskDTO = {
        title: task.title,
        description: task.description,
        assignedTo: task.assignedTo?.id || "",
        dueDate: task.dueDate,
        priority: task.priority,
        status: task.status,
      };

      // Set form values
      setValue("title", taskData.title);
      setValue("description", taskData.description);
      setValue("assignedTo", taskData.assignedTo);
      setValue("dueDate", taskData.dueDate?.split("T")[0] ?? "");
      setValue("priority", taskData.priority);
      setValue("status", taskData.status);

      // Store original data for comparison
      setOriginalData(taskData);
      console.log("Task loaded:", taskData);
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
    }
  }, [modalMode]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center"
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
        className="bg-white rounded-lg p-6 w-[1200px] h-[600px] relative z-50 overflow-auto flex flex-col  "
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.15 }}
      >
        {isLoading ? (
          <div>Loading...</div>
        ) : (
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
                <InputField
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
              <div className="w-1/3 flex flex-col gap-4 border border-gray-400 p-2 rounded">
                <Dropdown
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
                <InputField
                  label="Due Date"
                  id="dueDate"
                  type="date"
                  error={errors.dueDate?.message}
                  register={register}
                  flexDir="row"
                />

                <Dropdown
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

                <Dropdown
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
              {modalMode === "display" && hasChanges && (
                <div className="text-xs text-red-500 absolute bottom-4 right-4">
                  * Unsaved changes
                </div>
              )}
            </div>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
};

export default CreateTaskModal;
