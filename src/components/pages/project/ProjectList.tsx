import { useEffect, useState } from "react";
import { ProjectService } from "../../../services/ProjectService";
import { ProjectResponseDTO } from "../../../models/dtos/Project";
import ButtonWithIcon from "../../atoms/ButtonWithIcon";
import { Check, Plus } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { useToast } from "../../../hooks/useToast";
import CreateProjectModal from "../../modals/CreateProjectModal";
import { useNavigate } from "react-router-dom";
import ProjectCard from "../../atoms/ProjectCard";

const ProjectList = () => {
  const [projects, setProjects] = useState<ProjectResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreatePopupModalOpen, setIsCreatePopupModalOpen] = useState(false);

  const navigate = useNavigate();

  const { showToast } = useToast();

  const closeModal = () => {
    setIsCreatePopupModalOpen(false);
    fetchProjects();
  };

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const projects = await ProjectService.getProjects();
      setProjects(projects || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      showToast("Error fetching projects", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const onProjectClicked = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl">Projects</h2>
        <ButtonWithIcon
          icon={<Plus size={20} />}
          text="Create Project"
          onClick={() => setIsCreatePopupModalOpen(true)}
        />
      </div>

      <div className="flex ">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={() => onProjectClicked(project.id)}
          />
        ))}
      </div>

      <AnimatePresence>
        {isCreatePopupModalOpen && (
          <CreateProjectModal closeModal={closeModal} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectList;
