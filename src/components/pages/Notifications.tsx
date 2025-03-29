import { useNotifications } from "../../hooks/useNotification";
import NotificationCard from "../molecules/NotificationCard";

const Notifications: React.FC = () => {
  const { notifications } = useNotifications();

  return (
    <div>
      {notifications.map((notification) => (
        <NotificationCard key={notification.id} notification={notification} />
      ))}
    </div>
  );
};

export default Notifications;
