import React, { useState } from "react";
import SearchableDropdown from "../molecules/SearchableDropdown";
import { User } from "../../models/dtos/User";
import { UserService } from "../../services/UserService";
import { motion } from "framer-motion";
import { useProject } from "../../hooks/useProject";
import NameBubble from "../atoms/NameBubble";
import { Plus, X } from "lucide-react";
import Button from "../atoms/Button";
import { InvitationService } from "../../services/InvitationService";
import { useToast } from "../../hooks/useToast";

interface InviteMemberModalProps {
  onClose: () => void;
}

const InviteMemberModal: React.FC<InviteMemberModalProps> = ({ onClose }) => {
  const [projectMemberSearchValue, setProjectMemberSearchValue] = useState("");
  const [isMemberSelected, setIsMemberSelected] = useState(false);
  const [selectedMember, setSelectedMember] = useState<User | null>(null);

  const [isSendingInvite, setIsSendingInvite] = useState(false);

  const { project } = useProject();
  const { showToast } = useToast();

  const handleInvite = async () => {
    if (!project || !selectedMember) {
      return;
    }

    setIsSendingInvite(true);

    try {
      const res = await InvitationService.InviteUserToProject(
        project?.id || "",
        selectedMember?.id || ""
      );
      console.log(res);
      showToast("User invited", { type: "success" });
      onClose();
    } catch (err) {
      console.error(err);
      showToast("Failed to invite user", { type: "error" });
    } finally {
      setIsSendingInvite(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-10 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      <div
        className="fixed inset-0 bg-black bg-opacity-50 "
        onClick={onClose}
      ></div>

      <motion.div
        className="bg-white  p-6 w-[650px]  relative z-50 flex flex-col rounded-xl "
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.15 }}
      >
        <div>Add People to {project?.name}</div>

        <div className="mt-4">
          {isMemberSelected ? (
            <div className="flex items-center justify-between border border-primary bg-primaryLight rounded-xl p-2">
              <div className="flex items-center">
                <NameBubble
                  name={selectedMember?.name || ""}
                  showTooltip={false}
                />
                <div className="ml-2 text-primary">
                  <div className="font-bold">{selectedMember?.name}</div>
                  <div>{selectedMember?.email}</div>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsMemberSelected(false);
                  setSelectedMember(null);
                  setProjectMemberSearchValue("");
                }}
                className="ml-2"
              >
                <X size={24} color="#0055cc" />
              </button>
            </div>
          ) : (
            <SearchableDropdown<User>
              label="Search by name or email"
              searchValue={projectMemberSearchValue}
              setSearchValue={setProjectMemberSearchValue}
              onSearchFunction={UserService.SearchUser}
              onItemSelect={(user) => {
                console.log(user);
                setIsMemberSelected(true);
                setSelectedMember(user);
              }}
              shouldAllowSelection={(user) =>
                !project?.projectMembers.some(
                  (member) => member.userId === user.id
                ) &&
                !project?.invitations.some(
                  (invitation) => invitation.invitedUserId === user.id
                )
              }
              notAllowedText={(user) => {
                if (
                  project?.projectMembers.some(
                    (member) => member.userId === user.id
                  )
                ) {
                  return "User is already a project member";
                }
                if (
                  project?.invitations.some(
                    (invitation) => invitation.invitedUserId === user.id
                  )
                ) {
                  return "User is already invited to the project";
                }
                return "";
              }}
              getDisplayValue={(user) => `${user.email} - ${user.name}`}
              getPrimaryText={(user) => user.name}
              getSecondaryText={(user) => user.email}
            />
          )}
        </div>

        <div className="mt-4 flex gap-4 justify-end">
          <Button
            icon={<X size={20} />}
            text="Cancel"
            onClick={onClose}
            bg="no-bg"
          />

          <Button
            icon={<Plus size={20} />}
            text={`Add ${selectedMember?.name || "Member"}`}
            onClick={handleInvite}
            disabled={!isMemberSelected || isSendingInvite}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default InviteMemberModal;
