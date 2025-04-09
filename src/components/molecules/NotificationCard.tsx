import { useNavigate } from "react-router-dom";
import { Notification } from "../../models/dtos/Notification";
import axios from "axios";
import { baseUrl } from "../../utils/utils";
import { useAuth } from "../../hooks/auth/useAuth";
import { formatDateAndTime } from "../../utils/dateUtils";
import { usePopup } from "../../hooks/usePopup";
import JoinProject from "../modals/JoinProject";
import { cn } from "../../utils/tailwindMerge";

interface NotificationCardProps {
  notification: Notification;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
}) => {
  const navigate = useNavigate();
  const { getIdToken } = useAuth();
  const { setPopupContent, setIsPopupVisible } = usePopup();

  const handleNavigation = async () => {
    const token = await getIdToken();

    if (
      notification.type === "task_assigned" ||
      notification.type === "comment_added"
    ) {
      navigate(
        `/projects/${notification.projectId}/tasks/${notification.taskId}`
      );
    } else if (
      notification.type === "project_invitation" &&
      notification.projectId
    ) {
      // navigate(`/projects/${notification.projectId}/join`);
      setIsPopupVisible(true);
      setPopupContent(
        <JoinProject
          projectId={notification.projectId}
          projectName={notification.content.split(":")[1]}
          notificationId={notification.invitationId}
        />
      );
    }

    if (token) {
      try {
        const res = await axios.post(
          `${baseUrl}/notifications/${notification.id}/read`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    }
  };

  return (
    <div
      className={cn(
        "border border-l-4 border-l-primary p-4 mb-2  cursor-pointer hover:shadow-md transition-shadow duration-200",
        notification.status === "unread" ? "bg-blue-100" : "bg-white"
      )}
      onClick={handleNavigation}
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-medium">{notification.content}</p>
          <span className="text-xs text-gray-500">
            {formatDateAndTime(notification.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
