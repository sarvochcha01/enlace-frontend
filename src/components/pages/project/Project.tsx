import { Outlet, useNavigate, useParams } from "react-router-dom";
import { validate } from "uuid";
import { useToast } from "../../../hooks/useToast";
import { useProject } from "../../../hooks/useProject";
import { ProjectService } from "../../../services/ProjectService";
import { useUser } from "../../../hooks/useUser";
import { useEffect } from "react";

const Project = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { showToast } = useToast();
  const { dbUser } = useUser();

  const navigate = useNavigate();

  const {
    setProject,
    setProjectMember,
    setProjectMembers,
    setIsLoading,
    isLoading,
  } = useProject();

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full h-full">
      <Outlet />
    </div>
  );
};

export default Project;
