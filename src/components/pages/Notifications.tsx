import { useEffect } from "react";
import { useNotifications } from "../../hooks/useNotification";
import NotificationCard from "../molecules/NotificationCard";

const Notifications: React.FC = () => {
  const { notifications, fetchNotifications } = useNotifications();

  useEffect(() => {
    const fetchData = async () => {
      await fetchNotifications();
    };

    fetchData();
  }, []);

  return (
    <div>
      {notifications.map((notification) => (
        <NotificationCard key={notification.id} notification={notification} />
      ))}
    </div>
  );
};

export default Notifications;
