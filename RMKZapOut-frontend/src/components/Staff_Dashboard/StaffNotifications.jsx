import { useState } from "react";
import { Bell, CheckCircle, AlertCircle, Clock, Trash2 } from "lucide-react";

const affNotifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "New Gate Pass request from Student ID 221045",
      type: "approval",
      time: "2 mins ago",
      read: false,
    },
    {
      id: 2,
      message: "On-Duty request pending verification",
      type: "reminder",
      time: "15 mins ago",
      read: false,
    },
    {
      id: 3,
      message: "Gate Pass rejected by HOD",
      type: "system",
      time: "1 hour ago",
      read: true,
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = id => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === id ? { ...n, read: true } : n
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const typeIcon = type => {
    if (type === "approval") return <CheckCircle className="text-green-400" />;
    if (type === "reminder") return <Clock className="text-yellow-400" />;
    return <AlertCircle className="text-red-400" />;
  };

  return (
    <div className="min-h-screen text-white p-6 bg-gradient-to-br from-[#020617] via-[#041b32] to-[#020617]">

      <h1 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <Bell className="text-[#00d3d1]" />
        Notifications
      </h1>

      <div className="flex gap-4 mb-6">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur border border-white/20">
          <span className="text-sm">Unread</span>
          <span className="bg-red-500 text-xs px-2 py-0.5 rounded-full">
            {unreadCount}
          </span>
        </div>

        <button
          onClick={markAllAsRead}
          className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur border border-white/20 hover:bg-white/20 transition"
        >
          Mark all as read
        </button>

        <button
          onClick={clearAll}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/20 border border-red-500/40 hover:bg-red-500/30 transition"
        >
          <Trash2 size={16} />
          Clear all
        </button>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 && (
          <div className="text-center py-10 text-white/60 bg-white/5 rounded-xl border border-white/10">
            No notifications available
          </div>
        )}

        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`flex items-start justify-between gap-4 p-4 rounded-xl backdrop-blur border 
              ${notification.read
                ? "bg-white/5 border-white/10"
                : "bg-white/10 border-[#00d3d1]/40"}
            `}
          >
            <div className="flex gap-3">
              {typeIcon(notification.type)}
              <div>
                <p className={`text-sm ${notification.read ? "text-white/70" : "text-white"}`}>
                  {notification.message}
                </p>
                <span className="text-xs text-white/50">
                  {notification.time}
                </span>
              </div>
            </div>

            {!notification.read && (
              <button
                onClick={() => markAsRead(notification.id)}
                className="text-xs px-3 py-1 rounded-lg bg-[#00d3d1]/20 border border-[#00d3d1]/40 hover:bg-[#00d3d1]/30 transition"
              >
                Mark as read
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default affNotifications;
