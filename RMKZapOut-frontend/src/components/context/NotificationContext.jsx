import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import notificationService from "../../services/notificationService.jsx";

/* ================= CONTEXT ================= */
const NotificationContext = createContext(null);

/* ================= PROVIDER ================= */
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  /* 🔌 Socket + Initial Fetch */
  useEffect(() => {
    if (!userId) return;

    const socket = io("http://localhost:5000");

    socket.emit("joinRoom", userId);

    notificationService.getNotifications(userId).then((res) => {
      setNotifications(res.data);
    });

    socket.on("newNotification", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  /* 🔢 Unread Count */
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  /* ✅ Actions */
  const markAllRead = async () => {
    if (!userId) return;
    await notificationService.markAllAsRead(userId);
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, is_read: 1 }))
    );
  };

  const markRead = async (id) => {
    await notificationService.markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, is_read: 1 } : n
      )
    );
  };

  const clearAll = async () => {
    if (!userId) return;
    await notificationService.clearAll(userId);
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAllRead,
        markRead,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

/* ================= HOOK ================= */
/* eslint-disable react-refresh/only-export-components */
export const useNotifications = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotifications must be used inside NotificationProvider"
    );
  }

  return context;
};
