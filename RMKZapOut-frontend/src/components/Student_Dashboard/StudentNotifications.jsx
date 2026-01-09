import { useState } from "react";
import {
  Bell,
  CheckCircle,
  Clock,
  AlertCircle,
  Trash2,
  Eye,
  EyeOff
} from "lucide-react";

const initialNotifications = [
  {
    id: 1,
    message: "Your Gate Pass request has been approved",
    type: "approval",
    time: "2 mins ago",
    read: false
  },
  {
    id: 2,
    message: "Your request is with HOD",
    type: "system",
    time: "15 mins ago",
    read: false
  },
  {
    id: 3,
    message: "Return time approaching (30 mins)",
    type: "reminder",
    time: "1 hour ago",
    read: true
  },
  {
    id: 4,
    message: "QR code activated for today",
    type: "system",
    time: "Yesterday",
    read: true
  }
];

const typeConfig = {
  approval: {
    icon: CheckCircle,
    color: "text-green-400"
  },
  reminder: {
    icon: Clock,
    color: "text-yellow-400"
  },
  system: {
    icon: AlertCircle,
    color: "text-cyan-400"
  }
};

export default function StudentNotifications() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeFilter, setActiveFilter] = useState("all");

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications =
    activeFilter === "all"
      ? notifications
      : notifications.filter(n => n.type === activeFilter);

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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-cyan-300 flex items-center gap-2">
          <Bell className="text-cyan-400" />
          Notifications
        </h2>

        <div className="flex items-center gap-3">
          {/* Unread Glass Card */}
          <div className="px-4 py-2 rounded-xl bg-red-500/20 border border-red-400 backdrop-blur-md text-red-300 text-sm">
            {unreadCount} Unread
          </div>

          {/* Mark All As Read Glass Card */}
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/20 border border-cyan-400 backdrop-blur-md text-cyan-300 text-sm hover:bg-cyan-500/30"
          >
            <EyeOff size={16} />
            Mark All as Read
          </button>

          {/* Clear All Glass Card */}
          <button
            onClick={clearAll}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/20 border border-red-400 backdrop-blur-md text-red-300 text-sm hover:bg-red-500/30"
          >
            <Trash2 size={16} />
            Clear All
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        {["all", "approval", "reminder", "system"].map(type => (
          <button
            key={type}
            onClick={() => setActiveFilter(type)}
            className={`px-4 py-2 rounded-lg text-sm backdrop-blur-md border transition
              ${
                activeFilter === type
                  ? "bg-cyan-500/30 text-white border-cyan-400"
                  : "bg-white/10 text-gray-300 border-white/20 hover:bg-white/20"
              }`}
          >
            {type === "all"
              ? "All"
              : type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Notifications */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="text-center text-gray-400 py-10">
            No notifications available
          </div>
        ) : (
          filteredNotifications.map(notification => {
            const Icon = typeConfig[notification.type].icon;

            return (
              <div
                key={notification.id}
                className={`flex justify-between items-start p-5 rounded-xl backdrop-blur-xl border
                  ${
                    notification.read
                      ? "bg-white/10 border-white/20"
                      : "bg-cyan-500/10 border-cyan-400"
                  }`}
              >
                <div className="flex gap-4">
                  <Icon
                    size={22}
                    className={typeConfig[notification.type].color}
                  />

                  <div>
                    <p className="text-white font-medium">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {notification.time}
                    </p>
                  </div>
                </div>

                {!notification.read && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    <Eye size={16} />
                    Mark as Read
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
