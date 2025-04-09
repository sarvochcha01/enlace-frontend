import { useNavigate } from "react-router-dom";
import { Notification } from "../../models/dtos/Notification";
import axios from "axios";
import { baseUrl } from "../../utils/utils";
import { useAuth } from "../../hooks/auth/useAuth";
import { formatDateAndTime } from "../../utils/dateUtils";

interface NotificationCardProps {
  notification: Notification;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
}) => {
  const navigate = useNavigate();
  const { getIdToken } = useAuth();

  const handleNavigation = async () => {
    const token = await getIdToken();

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
      navigate(`/projects/${notification.projectId}/join`);
    }
  };

  return (
    <div
      className={`border p-4 mb-2 rounded-lg shadow-md cursor-pointer ${
        notification.status === "unread" ? "bg-blue-100" : "bg-white"
      }`}
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
