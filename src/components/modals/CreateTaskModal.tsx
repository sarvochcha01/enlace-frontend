import React, { useState } from "react";
import { useToast } from "../../hooks/useToast";
import { motion } from "framer-motion";
import { SubmitHandler, useForm } from "react-hook-form";
import { CreateTaskDTO } from "../../models/task";
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

  const [isCreatingTask, setIsCreatingTask] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    reset,
  } = useForm<CreateTaskDTO>();

  const handleCreateTaskSubmit: SubmitHandler<CreateTaskDTO> = async (data) => {
    setIsCreatingTask(true);
    try {
      console.log("Creating task:", data);
      await TaskService.createTask(data, project!.id);
      console.log("Creating task:", data);
      showToast("Task created successfully", { type: "success" });
      reset();
      closeModal();
    } catch (error) {
      console.error("Error creating task:", error);
      showToast("Error creating task", { type: "error" });
    } finally {
      setIsCreatingTask(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
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
        <form onSubmit={handleSubmit(handleCreateTaskSubmit)}>
          <div className="text-center w-full mb-2 ">
            <h2 className="text-2xl font-bold text-gray-800">
              Create a New Task
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Fill in the details on what's need to be done
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
                control={control}
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
              text="Cancel"
              type="button"
              onClick={closeModal}
              bg="no-bg"
              disabled={isCreatingTask}
            />
            <ButtonWithIcon
              icon={<Check size={20} />}
              text="Create Task"
              type="submit"
              disabled={isCreatingTask}
            />
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default CreateTaskModal;
