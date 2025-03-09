import { useEffect, useState } from "react";
import { ProjectService } from "../../../services/ProjectService";
import { ProjectResponseDTO } from "../../../models/dtos/project";
import ButtonWithIcon from "../../atoms/ButtonWithIcon";
import { Check, Plus } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { useToast } from "../../../hooks/useToast";
import CreateProjectModal from "../../modals/CreateProjectModal";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/auth/useAuth";

const ProjectList = () => {
  const [projects, setProjects] = useState<ProjectResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreatePopupModalOpen, setIsCreatePopupModalOpen] = useState(false);

  const navigate = useNavigate();

  const { showToast } = useToast();

  const { getIdToken } = useAuth();

  const closeModal = () => {
    setIsCreatePopupModalOpen(false);
    // fetchProjects();
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

  const onProjectClicked = async (projectId: string) => {
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

      <div className="flex flex-col gap-2">
        {projects.map((project) => (
          <div
            key={project.id}
            className="p-2 border border-gray-200 rounded-lg flex justify-between items-center"
          >
            <div>
              <h3 className="text-lg font-medium">{project.name}</h3>
              <p className="text-sm text-gray-500">{project.key}</p>
            </div>
            <ButtonWithIcon
              icon={<Check size={20} />}
              text="View"
              bg="no-bg"
              onClick={() => onProjectClicked(project.id)}
            />
          </div>
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
