import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import SearchBar from "../../atoms/SearchBar";
import NameBubble from "../../atoms/NameBubble";
import TasksList from "../../organisms/TasksList";
import TaskHeadingCard from "../../atoms/TaskHeadingCard";

import ButtonWithIcon from "../../atoms/ButtonWithIcon";
import { Plus, Settings } from "lucide-react";
import { useTaskModal } from "../../../hooks/useTaskModal";
import TaskModal from "../../modals/TaskModal";
import { AnimatePresence } from "framer-motion";
import { useProject } from "../../../hooks/useProject";
import { TaskResponseDTO } from "../../../models/dtos/Task";
import { ProjectFilters } from "../../../models/ProjectFilters";
import { formatDate } from "../../../utils/dateUtils";

const ProjectDetails = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [assignedToFilter, setAssignedToFilter] = useState("");

  const [filters, setFilters] = useState<ProjectFilters | null>(null);
  const [filteredTasks, setFilteredTasks] = useState<TaskResponseDTO[] | null>(
    null
  );

  const { isTaskModalOpen, openTaskModal, closeTaskModal } = useTaskModal();
  const {
    project,
    setProject,
    setProjectMembers,
    setProjectMember,
    isLoading,
    refetchProject,
  } = useProject();

  const navigate = useNavigate();

  useEffect(() => {
    if (!project) return;
    console.log("Project", project);

    const filteredTasks = project.tasks?.filter((task) => {
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
  }, [searchQuery, assignedToFilter, setFilters]);

  const toggleAssigneeFilter = (memberId: string) => {
    if (assignedToFilter === memberId) {
      setAssignedToFilter("");
    } else {
      setAssignedToFilter(memberId);
    }
  };

  if (isLoading || !project) return <div>Loading...</div>;

  return (
    <div className="flex flex-col w-full h-full">
      <div className="w-full flex items-center justify-between">
        <div className="flex gap-2">
          <NavLink
            to="/projects"
            className="hover:underline"
            onClick={() => {
              setProject(null);
              setProjectMembers(null);
              setProjectMember(null);
            }}
          >
            Projects
          </NavLink>
          /<div>{project?.name}</div>
        </div>

        <div className="flex items-center gap-4">
          <Settings
            size={20}
            className="cursor-pointer"
            onClick={() => {
              navigate(`settings`);
            }}
          />
        </div>
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
                  isFilter={true}
                  onClick={() => toggleAssigneeFilter(member.id)}
                />
              ))}
            </div>
          </div>

          <div>
            <ButtonWithIcon
              icon={<Plus size={20} />}
              text="Create Task"
              onClick={() => openTaskModal("add", "todo")}
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
                  assignedTo={task.assignedTo?.name}
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
                  assignedTo={task.assignedTo?.name}
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
                  assignedTo={task.assignedTo?.name}
                />
              ))}
          </TasksList>
        </div>
      </div>

      <AnimatePresence onExitComplete={refetchProject}>
        {isTaskModalOpen && (
          <TaskModal
            closeModal={() => {
              closeTaskModal();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectDetails;
