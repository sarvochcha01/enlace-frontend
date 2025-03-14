import React from "react";
import { ProjectMemberResponseDTO } from "../../models/dtos/ProjectMember";
import Dropdown from "../atoms/Dropdown";

interface ProjectMembersListProps {
  projectMembers: ProjectMemberResponseDTO[] | null;
  memberRoles: Record<string, string>;
  currentUserId: string | undefined;
  isCurrentUserOwner: boolean;
  onRoleChange: (memberId: string, role: string) => void;
}

const ProjectMembersList: React.FC<ProjectMembersListProps> = ({
  projectMembers,
  memberRoles,
  currentUserId,
  isCurrentUserOwner,
  onRoleChange,
}) => {
  return (
    <div className="flex flex-col gap-4 w-full pb-4 border-b border-gray-200">
      <div className="flex flex-col gap-2">
        {projectMembers
          ?.sort((a, b) => {
            // Put current user at the top
            if (a.userId === currentUserId) return -1;
            if (b.userId === currentUserId) return 1;
            // Then sort alphabetically by name
            return a.name.localeCompare(b.name);
          })
          .map((member) => (
            <div key={member.id} className="flex items-center">
              <div className="flex items-center gap-2 min-w-96">
                <p>{member.name}</p>
                {member.userId === currentUserId && (
                  <p className="text-xs text-gray-500">(YOU)</p>
                )}
              </div>
              <Dropdown
                flexDir="row"
                editable={
                  isCurrentUserOwner &&
                  member.userId !== currentUserId &&
                  memberRoles[member.id] !== "owner"
                }
                value={memberRoles[member.id]}
                options={{
                  owner: "Owner",
                  editor: "Editor",
                  viewer: "Viewer",
                }}
                onChange={(value) => {
                  onRoleChange(member.id, value);
                }}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default ProjectMembersList;
