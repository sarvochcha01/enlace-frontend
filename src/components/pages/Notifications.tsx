import { useEffect } from "react";
import { useNotifications } from "../../hooks/useNotification";
import NotificationCard from "../molecules/NotificationCard";
import { usePopup } from "../../hooks/usePopup";

const Notifications: React.FC = () => {
  const { notifications, fetchNotifications } = useNotifications();

  useEffect(() => {
    const fetchData = async () => {
      await fetchNotifications();
    };

    fetchData();
  }, []);

  return (
    <div className="w-full h-full flex flex-col overflow-y-auto">
      <h1 className="text-2xl mb-4">Recent Notifications</h1>
      {notifications.map((notification) => (
        <NotificationCard key={notification.id} notification={notification} />
      ))}
    </div>
  );
};

export default Notifications;
