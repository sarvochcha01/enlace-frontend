import { useNavigate } from "react-router-dom";
import { Notification } from "../../models/dtos/Notification";
import axios from "axios";
import { baseUrl } from "../../utils/utils";
import { useAuth } from "../../hooks/auth/useAuth";

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

    if (
      notification.type === "task_assigned" ||
      notification.type === "comment_added"
    ) {
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

      navigate(
        `/projects/${notification.projectId}/tasks/${notification.taskId}`
      );
    } else if (
      notification.type === "project_invitation" &&
      notification.projectId
    ) {
      navigate(`/projects/${notification.projectId}`);
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
            {new Date(notification.createdAt).toLocaleString()}
          </span>
        </div>
        <div className="flex gap-2 items-center">
          <span
            className={`px-2 py-1 text-xs rounded ${
              notification.status === "unread"
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-black"
            }`}
          >
            {notification.status === "unread" ? "New" : "Read"}
          </span>
          <button
            className="px-3 py-1 border rounded text-sm bg-gray-200 hover:bg-gray-300"
            onClick={(e) => {
              e.stopPropagation();
              handleNavigation();
            }}
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
