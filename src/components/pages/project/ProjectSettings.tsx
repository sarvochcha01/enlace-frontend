import { useEffect, useState } from "react";
import ButtonWithIcon from "../../atoms/ButtonWithIcon";
import { Check, ChevronLeft, LogOut, Trash } from "lucide-react";
import { useProject } from "../../../hooks/useProject";
import { ProjectService } from "../../../services/ProjectService";
import { useToast } from "../../../hooks/useToast";
import { useNavigate, useParams } from "react-router-dom";
import InputField from "../../atoms/InputField";
import { UpdateProjectDTO } from "../../../models/dtos/Project";
import Dropdown from "../../atoms/Dropdown";
import { ProjectMemberService } from "../../../services/ProjectMemberService";
import { useUser } from "../../../hooks/useUser";

const ProjectSettings = () => {
  const { showToast } = useToast();
  const { project, refetchProject, projectMembers } = useProject();
  const { dbUser } = useUser();
  const navigate = useNavigate();
  const { projectId } = useParams();

  const [isLeaving, setIsLeaving] = useState(false);
  const [projectData, setProjectData] = useState<UpdateProjectDTO>({
    name: "",
    description: "",
  });

  const [isDataChanged, setIsDataChanged] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [memberRoles, setMemberRoles] = useState<Record<string, string>>({});

  useEffect(() => {
    if (project) {
      setProjectData({
        name: project.name,
        description: project.description,
      });
    }
  }, [project]);

  useEffect(() => {
    if (!project) return;

    setIsDataChanged(
      JSON.stringify({
        name: projectData.name.trim(),
        description: projectData.description.trim(),
      }) !==
        JSON.stringify({
          name: project.name,
          description: project.description,
        })
    );
  }, [project, projectData]);

  useEffect(() => {
    if (!projectMembers) return;

    const roles: Record<string, string> = {};
    projectMembers.forEach((member) => {
      roles[member.id] = member.role;
    });

    setMemberRoles(roles);
  }, [projectMembers]);

  const leaveProject = async () => {
    if (!project) return;
    setIsLeaving(true);

    try {
      await ProjectService.leaveProject(project.id);
      showToast("Left project successfully", { type: "success" });
      navigate("/projects");
    } catch (error) {
      showToast("Error leaving project", { type: "error" });
    } finally {
      setIsLeaving(false);
    }
  };

  const updateProject = async () => {
    if (!project) return;

    setIsUpdating(true);

    try {
      await ProjectService.updateProject(project.id, projectData);
      showToast("Project updated successfully", { type: "success" });
      await refetchProject();
    } catch (error) {
      showToast("Error updating project", { type: "error" });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRoleChange = async (memberId: string, role: string) => {
    if (!project) return;

    console.log(memberId, role);

    ProjectMemberService.updateProjectMember(project.id, memberId, role)
      .then(() => {
        showToast("Role updated successfully", { type: "success" });
      })
      .catch(() => {
        showToast("Error updating role", { type: "error" });
      });
  };

  const handleDeleteProject = async () => {
    if (!project) return;

    try {
      await ProjectService.deleteProject(project.id);
      showToast("Project deleted successfully", { type: "success" });
      navigate("/projects");
    } catch (error) {
      showToast("Error deleting project", { type: "error" });
    }
  };

  return (
    <div className="flex flex-col w-full items-center">
      <div className="flex w-full justify-between items-center">
        <ChevronLeft
          size={20}
          className="cursor-pointer"
          onClick={() => {
            navigate(`/projects/${projectId}`);
          }}
        />
        <ButtonWithIcon
          icon={<LogOut size={20} />}
          text="Leave Project"
          onClick={leaveProject}
          bg="no-bg"
          className="text-red-500"
          disabled={isLeaving}
        />
      </div>

      <div className="flex flex-col w-full mt-4">
        <h2 className="text-lg font-semibold">General</h2>
        <div className="flex flex-col gap-4 w-full  pb-4 border-b border-gray-200">
          <InputField
            label="Project Name"
            value={projectData.name}
            onChange={(value) => {
              setProjectData({ ...projectData, name: value });
            }}
          />

          <InputField
            label="Description"
            value={projectData.description}
            onChange={(value) => {
              setProjectData({ ...projectData, description: value });
            }}
          />

          <ButtonWithIcon
            icon={<Check size={20} />}
            text="Save"
            className="w-48"
            onClick={updateProject}
            disabled={!isDataChanged}
          />
        </div>
      </div>

      <div className="flex flex-col w-full mt-4">
        <h2 className="text-lg font-semibold">Members</h2>
        <div className="flex flex-col gap-4 w-full  pb-4 border-b border-gray-200">
          <div className="flex flex-col gap-2">
            {projectMembers?.map((member) => (
              <div key={member.id} className="flex items-center">
                <div className="flex items-center gap-2">
                  <p>{member.name}</p>
                  {member.userId === dbUser?.id && (
                    <p className="text-xs text-gray-500">(YOU)</p>
                  )}
                </div>
                <Dropdown
                  flexDir="row"
                  value={member.role}
                  options={{
                    owner: "Owner",
                    editor: "Editor",
                    viewer: "Viewer",
                  }}
                  onChange={(value) => {
                    handleRoleChange(member.id, value);
                  }}
                />
              </div>
            ))}
          </div>

          <ButtonWithIcon
            icon={<Check size={20} />}
            text="Save"
            className="w-48"
            onClick={updateProject}
            disabled={!isDataChanged}
          />
        </div>
      </div>

      <ButtonWithIcon
        icon={<Trash size={20} />}
        text="Delete Project"
        onClick={handleDeleteProject}
        bg="no-bg"
        className="text-red-500 mt-4"
        disabled={isLeaving}
      />
    </div>
  );
};

export default ProjectSettings;
