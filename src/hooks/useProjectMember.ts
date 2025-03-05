import { useContext } from "react";
import { ProjectMemberContext } from "../context/ProjectMemberContext";

export const useProjectMember = () => {
  const context = useContext(ProjectMemberContext);

  if (!context) {
    throw new Error(
      "useProjectMember must be used within a ProjectMemberProvider"
    );
  }

  return context;
};
