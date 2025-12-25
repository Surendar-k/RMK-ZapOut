import { useState } from "react";
import {
  Bell,
  ShieldAlert,
  Users,
  Settings,
  CheckCircle,
  Trash2,
} from "lucide-react";

const initialNotifications = [
  {
    id: 1,
    title: "New Student Registered",
    message: "A new student account has been created.",
    type: "users",
    time: "2 mins ago",
    read: false,
  },
  {
    id: 2,
    title: "Role Updated",
    message: "Staff role changed to HOD.",
    type: "system",
    time: "10 mins ago",
    read: false,
  },
  {
    id: 3,
    title: "Security Alert",
    message: "Multiple failed login attempts detected.",
    type: "security",
    time: "30 mins ago",
    read: true,
  },
];

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
  };

  const clearAll = () => setNotifications([]);

  const filteredNotifications =
    filter === "all"
      ? notifications
      : notifications.filter((n) => n.type === filter);

  const iconMap = {
    users: <Users className="text-cyan-400" />,
    system: <Settings className="text-indigo-400" />,
    security: <ShieldAlert className="text-red-400" />,
  };

  return (
    <div className="p-8 text-white">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Bell className="text-cyan-400" />
          <h1 className="text-2xl font-semibold">Admin Notifications</h1>
          {unreadCount > 0 && (
            <span className="ml-2 px-3 py-1 rounded-full text-xs bg-red-500">
              {unreadCount} Unread
            </span>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
          >
            Mark All as Read
          </button>
          <button
            onClick={clearAll}
            className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 transition"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex gap-3 mb-6">
        {["all", "users", "system", "security"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm transition
              ${
                filter === f
                  ? "bg-cyan-500 text-black"
                  : "bg-white/10 hover:bg-white/20"
              }`}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      {/* NOTIFICATION LIST */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 && (
          <div className="text-white/50 text-center py-10">
            No notifications available
          </div>
        )}

        {filteredNotifications.map((n) => (
          <div
            key={n.id}
            className={`p-5 rounded-2xl border border-white/10 backdrop-blur-xl
              ${
                n.read
                  ? "bg-white/5"
                  : "bg-white/10 shadow-lg"
              }`}
          >
            <div className="flex justify-between">
              <div className="flex gap-4">
                {iconMap[n.type]}
                <div>
                  <h3 className="font-semibold">{n.title}</h3>
                  <p className="text-sm text-white/70">
                    {n.message}
                  </p>
                  <span className="text-xs text-white/40">
                    {n.time}
                  </span>
                </div>
              </div>

              {!n.read && (
                <button
                  onClick={() => markAsRead(n.id)}
                  className="flex items-center gap-1 text-xs text-green-400 hover:underline"
                >
                  <CheckCircle size={14} />
                  Mark as Read
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminNotifications;
