import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { validate } from "uuid";
import { useToast } from "../../../hooks/useToast";
import { ProjectService } from "../../../services/ProjectService";

const JoinProject = () => {
  const { projectId } = useParams();

  const { showToast } = useToast();
  const navigate = useNavigate();

  const [projectName, setProjectName] = useState("");

  const fetchProjectName = async () => {
    if (!validate(projectId)) {
      showToast("Invalid project ID", { type: "error" });
      navigate("/projects");
      return;
    }

    const res = await ProjectService.getProjectName(projectId!);
    setProjectName(res.projectName);
  };

  const joinProject = async () => {
    try {
      const res = await ProjectService.joinProject(projectId!);
      console.log(res);
      showToast("Project Joined", { type: "success" });
      navigate(`/projects`);
    } catch (error) {
      console.log(error);
      showToast("Failed to join project", { type: "error" });
    }
  };

  useEffect(() => {
    fetchProjectName();
  }, [projectId]);

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="w-full max-w-sm p-4 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Join Project</h1>
        <p className="mb-4">
          You are about to join the project{" "}
          <span className="font-semibold">{projectName}</span>. Are you sure you
          want to join?
        </p>
        <div className="flex justify-between">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg"
            onClick={() => navigate(`/projects`)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            onClick={joinProject}
          >
            Join
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinProject;
