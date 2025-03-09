import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { ProjectService } from "../../../services/ProjectService";
import { useToast } from "../../../hooks/useToast";
import { validate } from "uuid";
import SearchBar from "../../atoms/SearchBar";
import NameBubble from "../../atoms/NameBubble";
import TasksList from "../../organisms/TasksList";
import TaskHeadingCard from "../../atoms/TaskHeadingCard";
import { formatDate } from "../../../utils/utils";
import ButtonWithIcon from "../../atoms/ButtonWithIcon";
import { Plus } from "lucide-react";
import { useTaskModal } from "../../../hooks/useTaskModal";
import TaskModal from "../../modals/TaskModal";
import { AnimatePresence } from "framer-motion";
import { useProject } from "../../../hooks/useProject";
import { TaskResponseDTO } from "../../../models/dtos/Task";
import { ProjectFilters } from "../../../models/ProjectFilters";
import { useProjectMember } from "../../../hooks/useProjectMember";
import { useUser } from "../../../hooks/useUser";

const ProjectDetails = () => {
  const { projectId } = useParams<{ projectId: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [assignedToFilter, setAssignedToFilter] = useState("");

  const [filters, setFilters] = useState<ProjectFilters | null>(null);
  const [filteredTasks, setFilteredTasks] = useState<TaskResponseDTO[] | null>(
    null
  );

  const { setProjectMember, setProjectMembers } = useProjectMember();
  const { project, setProject } = useProject();
  const { showToast } = useToast();
  const { isTaskModalOpen, openTaskModal, closeTaskModal } = useTaskModal();
  const { dbUser } = useUser();

  const navigate = useNavigate();

  const fetchProjectDetails = async () => {
    if (!projectId) return;

    if (!validate(projectId)) {
      showToast("Invalid project ID", { type: "error" });
      navigate("/projects");
      return;
    }

    setIsLoading(true);
    try {
      const projectRes = await ProjectService.getProject(projectId);
      // const projectMemberRes = await ProjectMemberService.getProjectMember(
      //   projectId
      // );

      console.log(projectRes);

      setProjectMembers(projectRes.projectMembers || []);
      setProjectMember(
        projectRes.projectMembers.find(
          (member) => member.userId === dbUser?.id
        ) || null
      );
      setProject(projectRes);
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

  useEffect(() => {
    if (!project) return;

    const filteredTasks = project.tasks.filter((task) => {
      if (!filters) return true;

      const searchMatch =
        task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.description?.toLowerCase().includes(filters.search.toLowerCase());

      const assignedToMatch =
        task.assignedTo?.id === filters.assignedTo || filters.assignedTo === "";

      return searchMatch && assignedToMatch;
    });

    setFilteredTasks(filteredTasks);
  }, [project, filters]);

  useEffect(() => {
    const filterSettings: ProjectFilters = {
      search: searchQuery,
      assignedTo: assignedToFilter,
    };
    setFilters(filterSettings);
  }, [searchQuery, statusFilter, assignedToFilter, setFilters]);

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
    setAssignedToFilter("");
  };

  const toggleAssigneeFilter = (memberId: string) => {
    if (assignedToFilter === memberId) {
      setAssignedToFilter("");
    } else {
      setAssignedToFilter(memberId);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex gap-2">
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

      <div className="w-full mt-6 space-y-4">
        <div className="flex flex-col md:flex-row w-full gap-4 justify-between">
          <div className="flex gap-4">
            <div className="w-64">
              <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                isSearching={isSearching}
                setIsSearching={setIsSearching}
                placeholder="Search tasks"
              />
            </div>
            <div className="flex -space-x-2">
              {project?.projectMembers?.map((member, index, arr) => (
                <NameBubble
                  key={member.id}
                  name={member.name}
                  zIndex={arr.length - index}
                  isSelected={assignedToFilter === member.id}
                  onClick={() => toggleAssigneeFilter(member.id)}
                />
              ))}
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
      </div>

      <div className="h-full w-full overflow-x-auto mt-4 ">
        <div className="flex gap-2 min-h-full pb-8">
          <TasksList title="To Do" status="todo">
            {(filteredTasks || project?.tasks)
              ?.filter((task) => task.status === "todo")
              .map((task) => (
                <TaskHeadingCard
                  key={task.id}
                  id={task.id}
                  title={task.title}
                  priority={task.priority}
                  dueDate={
                    task.dueDate ? formatDate(task.dueDate) : "No due date"
                  }
                  assignee={task.assignedTo?.name}
                />
              ))}
          </TasksList>

          <TasksList title="In Progress" status="in-progress">
            {(filteredTasks || project?.tasks)
              ?.filter((task) => task.status === "in-progress")
              .map((task) => (
                <TaskHeadingCard
                  key={task.id}
                  id={task.id}
                  title={task.title}
                  priority={task.priority}
                  dueDate={
                    task.dueDate ? formatDate(task.dueDate) : "No due date"
                  }
                  assignee={task.assignedTo?.name}
                />
              ))}
          </TasksList>

          <TasksList title="Completed" status="completed">
            {(filteredTasks || project?.tasks)
              ?.filter((task) => task.status === "completed")
              .map((task) => (
                <TaskHeadingCard
                  key={task.id}
                  id={task.id}
                  title={task.title}
                  priority={task.priority}
                  dueDate={
                    task.dueDate ? formatDate(task.dueDate) : "No due date"
                  }
                  assignee={task.assignedTo?.name}
                />
              ))}
          </TasksList>
        </div>
      </div>

      <AnimatePresence>
        {isTaskModalOpen && (
          <TaskModal
            closeModal={() => {
              closeTaskModal();
              fetchProjectDetails();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectDetails;
