import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { ProjectService } from "../../../services/ProjectService";
import { useToast } from "../../../hooks/useToast";
import { validate } from "uuid";
import { ProjectResponseDTO } from "../../../models/project";
import SearchBar from "../../atoms/SearchBar";
import NameBubble from "../../atoms/NameBubble";
import TasksList from "../../organisms/TasksList";
import TaskHeadingCard from "../../atoms/TaskHeadingCard";
import { formatDate } from "../../../utils/utils";
import ButtonWithIcon from "../../atoms/ButtonWithIcon";
import { Plus } from "lucide-react";
import { useTaskModal } from "../../../hooks/useTaskModal";
import CreateTaskModal from "../../modals/CreateTaskModal";
import { AnimatePresence } from "framer-motion";
import { useProject } from "../../../hooks/useProject";

const ProjectDetails = () => {
  const { projectId } = useParams<{ projectId: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { project, setProject } = useProject();
  const { showToast } = useToast();
  const { isTaskModalOpen, openTaskModal, closeTaskModal } = useTaskModal();

  const navigate = useNavigate();

  const fetchProjectDetails = async () => {
    if (!projectId) return;

    if (!validate(projectId)) {
      showToast("Invalid project ID", { type: "error" });
      navigate("/projects");
      return;
    }

    setIsLoading;
    try {
      const res = await ProjectService.getProject(projectId);
      console.log(res);
      setProject(res);
    } catch (error) {
      showToast("Error fetching project details", { type: "error" });
      navigate("/projects");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [projectId]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col w-full h-full ">
      <div className="flex gap-2 ">
        <NavLink
          to="/projects"
          className="hover:underline"
          onClick={() => setProject(null)}
        >
          Projects
        </NavLink>
        /<div>{project?.name}</div>
      </div>
      <div className="text-2xl">{project?.name}</div>

      <div className="flex mt-6 gap-6 items-center justify-between">
        <div className="flex gap-6 items-center">
          <div className="w-64">
            <SearchBar
              isSearching={isSearching}
              setIsSearching={setIsSearching}
              searchKeyword={searchQuery}
              setSearchKeyword={setSearchQuery}
              placeholder="Search tasks..."
            />
          </div>
          <div className="flex -space-x-2">
            {project?.projectMembers?.slice(0, 4).map((member, index, arr) => (
              <NameBubble
                key={member.id}
                name={member.name}
                zIndex={arr.length - index}
              />
            ))}
            {(project?.projectMembers?.length ?? 0) > 4 && (
              <div className="w-10 h-10 flex items-center justify-center bg-gray-200 border-2 border-white rounded-full text-sm text-gray-600">
                +{(project?.projectMembers?.length ?? 0) - 4}
              </div>
            )}
          </div>
        </div>
        <div>
          <ButtonWithIcon
            icon={<Plus size={20} />}
            text="Create Task"
            onClick={() => openTaskModal("add")}
          />
        </div>
      </div>

      <div className="h-full w-full overflow-x-auto mt-4">
        <div className="flex gap-2 min-h-full pb-8">
          <TasksList title="To Do" status="todo">
            {project?.tasks
              ?.filter((task) => task.status === "todo")
              .map((task) => (
                <TaskHeadingCard
                  key={task.id}
                  id={task.id}
                  title={task.title}
                  priority={task.priority}
                  dueDate={
                    task.dueDate.Valid
                      ? formatDate(task.dueDate.Time!)
                      : "No due date"
                  }
                  assignee={task.AssignedTo?.name}
                />
              ))}
          </TasksList>

          <TasksList title="In Progress" status="in-progress">
            {project?.tasks
              ?.filter((task) => task.status === "in-progress")
              .map((task) => (
                <TaskHeadingCard
                  key={task.id}
                  id={task.id}
                  title={task.title}
                  priority={task.priority}
                  dueDate={
                    task.dueDate.Valid
                      ? formatDate(task.dueDate.Time!)
                      : "No due date"
                  }
                  assignee={task.AssignedTo?.name}
                />
              ))}
          </TasksList>

          <TasksList title="Completed" status="completed">
            {project?.tasks
              ?.filter((task) => task.status === "completed")
              .map((task) => (
                <TaskHeadingCard
                  key={task.id}
                  id={task.id}
                  title={task.title}
                  priority={task.priority}
                  dueDate={
                    task.dueDate.Valid
                      ? formatDate(task.dueDate.Time!)
                      : "No due date"
                  }
                  assignee={task.AssignedTo?.name}
                />
              ))}
          </TasksList>
        </div>
      </div>

      <AnimatePresence>
        {isTaskModalOpen && <CreateTaskModal closeModal={closeTaskModal} />}
      </AnimatePresence>
    </div>
  );
};

export default ProjectDetails;
