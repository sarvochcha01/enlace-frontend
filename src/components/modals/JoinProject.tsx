import { useNavigate, useParams } from "react-router-dom";
import { ProjectService } from "../../services/ProjectService";
import React, { useEffect, useState } from "react";
import { InvitationService } from "../../services/InvitationService";
import Button from "../atoms/Button";
import { useToast } from "../../hooks/useToast";
import { motion } from "framer-motion";

interface JoinProjectParams {
  projectId: string;
  projectName: string;
  notificationId: string;
}

const JoinProject: React.FC<JoinProjectParams> = ({
  projectId,
  projectName,
  notificationId,
}) => {
  const { showToast } = useToast();

  return (
    <motion.div
      className="bg-white border-l-4 border-primary shadow-md p-6  w-96"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      <div className="mb-6">
        <h1 className="text-xl font-medium text-gray-800">
          Project Invitation
        </h1>

        <div className="mt-4">
          <p className="text-gray-600 text-sm">
            You've been invited to collaborate on:
          </p>
          <p className="text-lg font-medium text-gray-900 mt-1">
            {projectName}
          </p>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Button
          text="Decline"
          bg="no-bg"
          className="text-red-500"
          onClick={() => {
            console.log(notificationId, projectId);
            InvitationService.UpdateInvitationStatus(
              notificationId,
              projectId,
              "declined"
            )
              .then(() => {
                alert("You have declined the invitation.");
              })
              .catch((error) => {
                console.error("Error declining invitation:", error);
                showToast("Error declining invitation", {
                  type: "error",
                });
              });
          }}
        />
        <Button
          text=" Join Project"
          onClick={() => {
            ProjectService.joinProject(projectId)
              .then(() => {
                alert("You have joined the project successfully!");

                InvitationService.UpdateInvitationStatus(
                  notificationId,
                  projectId,
                  "accepted"
                )
                  .then(() => {
                    alert("You have accepted the invitation.");
                  })
                  .catch((error) => {
                    console.error("Error accepting invitation:", error);
                    showToast("Error accepting invitation", {
                      type: "error",
                    });
                  });
              })
              .catch((error) => {
                console.error("Error joining project:", error);
                showToast("Error joining project", {
                  type: "error",
                });
              });
          }}
        />
      </div>
    </motion.div>
  );
};

export default JoinProject;
