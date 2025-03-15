import React, { useEffect, useState } from "react";
import { NotificationService } from "../../services/NotificationService";
import { InvitationResponseDTO } from "../../models/dtos/Invitation";
import { Link } from "react-router-dom";
import ButtonWithIcon from "../atoms/ButtonWithIcon";
import { Check, X } from "lucide-react";

const Notifications = () => {
  const [loading, setLoading] = useState(true);

  const [notifications, setNotifications] = useState<InvitationResponseDTO[]>(
    []
  );

  const fetchNotifications = async () => {
    const res = await NotificationService.GetAllNotifications();
    console.log(res);
    setNotifications(res);
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {notifications.map((notification) => {
        return (
          <div className="flex gap-8" key={notification.id}>
            {notification.name} has invited you to {notification.projectName}
            <ButtonWithIcon
              text="Accept"
              icon={<Check size={20} />}
              onClick={() =>
                NotificationService.RespondToInvitation(
                  notification.id,
                  notification.projectId,
                  "accepted"
                )
              }
            />
            <ButtonWithIcon
              text="Decline"
              icon={<X size={20} />}
              onClick={() =>
                NotificationService.RespondToInvitation(
                  notification.id,
                  notification.projectId,
                  "declined"
                )
              }
              className="bg-red-500 hover:bg-red-600"
            />
          </div>
        );
      })}
    </div>
  );
};

export default Notifications;
