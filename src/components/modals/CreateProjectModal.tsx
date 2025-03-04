import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import React, { useState } from "react";
import InputField from "../atoms/InputField";
import ButtonWithIcon from "../atoms/ButtonWithIcon";
import { SubmitHandler, useForm } from "react-hook-form";
import { CreateProjectDTO } from "../../models/project";
import { ProjectService } from "../../services/ProjectService";
import { useToast } from "../../hooks/useToast";

interface CreateProjectModalProps {
  closeModal: () => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  closeModal,
}) => {
  const { showToast } = useToast();
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<CreateProjectDTO>();

  const handleCreateProjectSubmit: SubmitHandler<CreateProjectDTO> = async (
    data
  ) => {
    setIsCreatingProject(true);
    try {
      await ProjectService.createProject(data);
      console.log("Creating project:", data);
      showToast("Project created successfully", { type: "success" });
      reset();
      closeModal();
    } catch (error) {
      console.error("Error creating project:", error);
      showToast("Error creating project", { type: "error" });
    } finally {
      setIsCreatingProject(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 flex flex-col p-4 bg-white "
      initial={{ opacity: 0, x: "-100%" }}
      animate={{ opacity: 1, x: "0%" }}
      exit={{ opacity: 0, x: "-100%" }}
      transition={{ duration: 0.15 }}
    >
      <div className="flex gap-2 items-center">
        <button onClick={closeModal}>
          <X size={24} />
        </button>
      </div>

      <form
        onSubmit={handleSubmit(handleCreateProjectSubmit)}
        className="w-full max-w-md mx-auto mt-10 flex flex-col gap-6 p-8 rounded-xl bg-white border border-gray-100 shadow-[0_15px_30px_-10px_rgba(0,0,0,0.35),0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.45),0_1px_5px_rgba(0,0,0,0.1)] transition-shadow duration-300"
      >
        <div className="text-center mb-2">
          <h2 className="text-2xl font-bold text-gray-800">
            Create New Project
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Fill in the details to get started
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <InputField
            label="Project Name"
            id="name"
            register={register}
            validation={{
              required: "Name is required",
              minLength: {
                value: 3,
                message: "Name must be at least 3 characters long",
              },
            }}
            error={errors.name?.message}
            placeholder="My Awesome Project"
            className="w-full"
          />
          <InputField
            label="Project Key"
            id="key"
            register={register}
            validation={{
              required: "Key is required",
              setValueAs: (v) => v.toUpperCase(),
              minLength: {
                value: 3,
                message: "Key must be at least 3 characters long",
              },
              maxLength: {
                value: 3,
                message: "Key must be at most 3 characters long",
              },
            }}
            error={errors.key?.message}
            placeholder="PRJ"
            helperText="A short 3 character unique identifier for your project (e.g. PRJ, ABC)"
            onChange={(e) =>
              setValue("key", e.target.value.toUpperCase(), {
                shouldValidate: true,
              })
            }
            className="w-full"
          />
          <InputField
            label="Description"
            id="description"
            register={register}
            placeholder="Brief description of your project"
            helperText="Optional: Describe what this project is about"
            className="w-full"
          />
        </div>

        <div className="mt-4 flex justify-center">
          <ButtonWithIcon
            icon={<Check size={20} />}
            text="Create Project"
            type="submit"
            disabled={isCreatingProject}
          />
        </div>

        {isCreatingProject && (
          <div className="flex justify-center mt-2">
            <span className="text-sm text-gray-500">
              Creating your project...
            </span>
          </div>
        )}
      </form>
    </motion.div>
  );
};

export default CreateProjectModal;
