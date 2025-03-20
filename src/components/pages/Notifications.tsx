import React, { useEffect, useState } from "react";
import { NotificationService } from "../../services/NotificationService";
import { InvitationResponseDTO } from "../../models/dtos/Invitation";
import { Link } from "react-router-dom";
import ButtonWithIcon from "../atoms/ButtonWithIcon";
import { Check, X } from "lucide-react";
import { useToast } from "../../hooks/useToast";

const Notifications = () => {
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState<string | null>(null);
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState<InvitationResponseDTO[]>(
    []
  );

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await NotificationService.GetAllNotifications();
      console.log(res);
      setNotifications(res);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      showToast("Failed to load notifications", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleInvitationResponse = async (
    id: string,
    projectId: string,
    response: "accepted" | "declined"
  ) => {
    try {
      setResponding(id);
      await NotificationService.RespondToInvitation(id, projectId, response);
      showToast(`Invitation ${response}`, { type: "success" });

      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification.id !== id)
      );
    } catch (error) {
      console.error(`Error ${response} invitation:`, error);
      showToast(`Failed to ${response} invitation`, { type: "error" });
    } finally {
      setResponding(null);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {notifications.length === 0 ? (
        <div>No notifications</div>
      ) : (
        notifications.map((notification) => (
          <div className="flex gap-8" key={notification.id}>
            {notification.name} has invited you to {notification.projectName}
            <ButtonWithIcon
              text="Accept"
              icon={<Check size={20} />}
              onClick={() =>
                handleInvitationResponse(
                  notification.id,
                  notification.projectId,
                  "accepted"
                )
              }
              disabled={responding === notification.id}
            />
            <ButtonWithIcon
              text="Decline"
              icon={<X size={20} />}
              onClick={() =>
                handleInvitationResponse(
                  notification.id,
                  notification.projectId,
                  "declined"
                )
              }
              className="bg-red-500 hover:bg-red-600"
              disabled={responding === notification.id}
            />
          </div>
        ))
      )}
    </div>
  );
};

export default Notifications;
