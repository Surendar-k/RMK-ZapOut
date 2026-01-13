import { useEffect } from "react";
import { Bell, Trash2, Check } from "lucide-react";
import { useNotifications } from "../context/NotificationContext.jsx";

const StaffNotifications = () => {
  const { notifications, markAllRead, markRead, clearAll } = useNotifications();

  /* 👀 Auto mark all read when page opens */
  useEffect(() => {
    if (notifications.some((n) => !n.is_read)) {
      markAllRead();
    }
  }, [notifications, markAllRead]);

  return (
    <div className="max-w-4xl mx-auto mt-12 bg-gray-900 rounded-2xl shadow-lg border border-gray-700">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <Bell className="text-indigo-400" />
          <h3 className="text-xl font-semibold text-white">Notifications</h3>
        </div>

        <div className="flex gap-2">
          <button
            onClick={markAllRead}
            className="flex items-center gap-1 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg transition"
          >
            <Check size={16} />
            Mark All Read
          </button>

          <button
            onClick={clearAll}
            className="flex items-center gap-1 px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition"
          >
            <Trash2 size={16} />
            Clear All
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="divide-y divide-gray-700">
        {notifications.length === 0 ? (
          <p className="text-center py-12 text-gray-400 text-lg">
            No notifications available
          </p>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`px-6 py-4 flex justify-between items-start transition-colors rounded-lg
                ${n.is_read ? "bg-gray-800 hover:bg-gray-700" : "bg-indigo-800/20 hover:bg-indigo-800/30"}`}
            >
              <div>
                <p className="font-medium text-white">{n.message}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(n.created_at).toLocaleString()}
                </p>
              </div>

              {!n.is_read && (
                <button
                  onClick={() => markRead(n.id)}
                  className="flex items-center gap-1 text-green-400 hover:text-green-500 text-sm"
                >
                  <Check size={16} /> Read
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StaffNotifications;
