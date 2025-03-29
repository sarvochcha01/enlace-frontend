import { createContext, useEffect, useState, useRef } from "react";
import { Notification } from "../models/dtos/Notification";
import { useAuth } from "../hooks/auth/useAuth";
import axios from "axios";
import { baseUrl } from "../utils/utils";

export interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  fetchNotifications: () => Promise<void>;
  markNotificationAsRead: (notificationId: string) => Promise<void>;
}

export const NotificationContext = createContext<
  NotificationContextType | undefined
>(undefined);

export const NotificationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, getIdToken } = useAuth();
  const websocketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchNotifications = async () => {
    try {
      const token = await getIdToken();
      if (!token) return;
      const { data } = await axios.get(`${baseUrl}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(data);
      setUnreadCount(
        data.filter((n: Notification) => n.status === "unread").length
      );
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      const token = await getIdToken();
      if (!token) return;

      await axios.put(
        `${baseUrl}/notifications/${notificationId}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, status: "read" } : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const connectWebSocket = async () => {
    if (
      websocketRef.current &&
      websocketRef.current.readyState !== WebSocket.CLOSED
    ) {
      websocketRef.current.close();
    }

    try {
      const token = await getIdToken();
      if (!token || !user) {
        console.log("Not connecting WebSocket: No user or token");
        return;
      }

      const wsUrl = `${baseUrl.replace(
        "http",
        "ws"
      )}/notifications/ws?token=${token}`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log("✅ WebSocket Connected");
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
      };

      ws.onmessage = (event) => {
        console.log("📩 New Notification:", event.data);
        try {
          const newNotification = JSON.parse(event.data);
          setNotifications((prev) => [newNotification, ...prev]);
          if (newNotification.status === "unread") {
            setUnreadCount((prev) => prev + 1);
          }
        } catch (e) {
          console.error("Error parsing notification data:", e);
        }
      };

      ws.onclose = (event) => {
        console.log("❌ WebSocket Disconnected", event.code, event.reason);
        if (user && !event.wasClean) {
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log("Attempting to reconnect WebSocket...");
            connectWebSocket();
          }, 5000);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket Error:", error);
      };

      websocketRef.current = ws;
    } catch (error) {
      console.error("Error setting up WebSocket:", error);
    }
  };

  useEffect(() => {
    if (user) {
      console.log(
        "User authenticated, fetching notifications and connecting WebSocket"
      );
      fetchNotifications();
      connectWebSocket();
    } else {
      console.log("No user, closing WebSocket if open");
      if (websocketRef.current) {
        websocketRef.current.close();
        websocketRef.current = null;
      }

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    }

    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
        websocketRef.current = null;
      }

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };
  }, [user]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        fetchNotifications,
        markNotificationAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
