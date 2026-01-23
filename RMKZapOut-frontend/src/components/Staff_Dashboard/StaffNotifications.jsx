import { useEffect } from "react";
import { Bell, Trash2, Check, CalendarCheck, LogOut } from "lucide-react";
import { useNotifications } from "../context/NotificationContext.jsx";

const StaffNotifications = () => {
  const { notifications, markAllRead, markRead, clearAll } = useNotifications();

  useEffect(() => {
    if (notifications.some((n) => !n.is_read)) {
      markAllRead();
    }
  }, [notifications, markAllRead]);

  const getTypeStyle = (msg) => {
    if (msg.toLowerCase().includes("on-duty")) {
      return {
        bg: "bg-emerald-900/30 border-emerald-600/40",
        badge: "bg-emerald-600",
        icon: <CalendarCheck size={18} className="text-emerald-400" />,
        label: "ON-DUTY",
      };
    }

    if (msg.toLowerCase().includes("gate")) {
      return {
        bg: "bg-indigo-900/30 border-indigo-600/40",
        badge: "bg-indigo-600",
        icon: <LogOut size={18} className="text-indigo-400" />,
        label: "GATE PASS",
      };
    }

    return {
      bg: "bg-gray-800 border-gray-700",
      badge: "bg-gray-600",
      icon: <Bell size={18} className="text-gray-400" />,
      label: "SYSTEM",
    };
  };

  return (
    <div className="max-w-5xl mx-auto mt-12 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-xl border border-gray-700 overflow-hidden">
      
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-700 bg-gray-900/80">
        <div className="flex items-center gap-3">
          <Bell className="text-indigo-400" />
          <h3 className="text-xl font-semibold text-white">
            Notifications
          </h3>

          {notifications.some((n) => !n.is_read) && (
            <span className="ml-2 px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
              NEW
            </span>
          )}
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
      <div className="p-5 space-y-3 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700">

        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Bell size={48} className="mb-4 opacity-40" />
            <p className="text-lg">No notifications available</p>
          </div>
        ) : (
         notifications.map((n) => {
  const style = getTypeStyle(n.message);

  // Extract student details from message using regex
  const match = n.message.match(
    /(.*) by (.*) \((.*) - (.*) Year, Reg: (.*)\)/
  );

  const title = match?.[1] || n.message;
  const name = match?.[2];
  const dept = match?.[3];
  const year = match?.[4];
  const reg = match?.[5];

  return (
    <div
      key={n.id}
      className={`p-4 rounded-xl border flex justify-between gap-4 transition-all
        ${style.bg} ${!n.is_read && "ring-1 ring-indigo-500/30"}`}
    >
      <div className="flex gap-3">
        <div className="mt-1">{style.icon}</div>

        <div className="space-y-1">
          {/* Badge */}
          <span
            className={`inline-block px-2 py-0.5 text-xs text-white rounded-full ${style.badge}`}
          >
            {style.label}
          </span>

          {/* Title */}
          <p className="font-medium text-white">{title}</p>

          {/* Student Info */}
          {name && (
            <div className="text-sm text-gray-300">
              <p className="font-semibold text-indigo-300">{name}</p>
              <p className="text-xs">
                {dept} • {year} Year • Reg No: {reg}
              </p>
            </div>
          )}

          {/* Time */}
          <p className="text-xs text-gray-400">
            {new Date(n.created_at).toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </div>
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
  );
          })
        )}


        

      </div>
    </div>
  );
};

export default StaffNotifications;
