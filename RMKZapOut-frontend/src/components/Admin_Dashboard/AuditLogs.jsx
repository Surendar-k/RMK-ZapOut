import { useState } from "react";
import { Search } from "lucide-react";

const mockLogs = [
  {
    id: 1,
    user: "Admin",
    role: "ADMIN",
    action: "CREATE",
    module: "Student",
    description: "Added new student record",
    timestamp: "25 Dec 2025, 10:45 AM",
  },
  {
    id: 2,
    user: "HOD",
    role: "HOD",
    action: "UPDATE",
    module: "Gate Pass",
    description: "Approved gate pass request",
    timestamp: "25 Dec 2025, 11:10 AM",
  },
  {
    id: 3,
    user: "Counsellor",
    role: "STAFF",
    action: "DELETE",
    module: "Notification",
    description: "Removed outdated notification",
    timestamp: "25 Dec 2025, 11:40 AM",
  },
  {
    id: 4,
    user: "System",
    role: "SYSTEM",
    action: "LOGIN",
    module: "Auth",
    description: "Admin logged in",
    timestamp: "25 Dec 2025, 12:00 PM",
  },
];

const actionColor = {
  CREATE: "text-green-400",
  UPDATE: "text-yellow-400",
  DELETE: "text-red-400",
  LOGIN: "text-cyan-400",
};

const AuditLogs = () => {
  const [search, setSearch] = useState("");
  const [filterAction, setFilterAction] = useState("ALL");

  const filteredLogs = mockLogs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.module.toLowerCase().includes(search.toLowerCase()) ||
      log.description.toLowerCase().includes(search.toLowerCase());

    const matchesAction =
      filterAction === "ALL" || log.action === filterAction;

    return matchesSearch && matchesAction;
  });

  return (
    <div className="p-6 text-white w-full h-full">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">🛡️ Audit Logs</h1>
        <p className="text-white/60 text-sm">
          Track all system & user activities
        </p>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-wrap gap-4 mb-6">
        {/* SEARCH */}
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl px-4 py-3 rounded-xl border border-white/10">
          <Search size={18} className="text-white/60" />
          <input
            type="text"
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none text-sm text-white placeholder-white/50"
          />
        </div>

        {/* ACTION FILTER */}
        <select
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
          className="bg-white/10 backdrop-blur-xl px-4 py-3 rounded-xl border border-white/10 text-sm outline-none"
        >
          <option value="ALL">All Actions</option>
          <option value="CREATE">Create</option>
          <option value="UPDATE">Update</option>
          <option value="DELETE">Delete</option>
          <option value="LOGIN">Login</option>
        </select>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">

        {/* TABLE HEADER */}
        <div className="grid grid-cols-6 gap-4 px-6 py-4 text-sm font-semibold bg-white/10">
          <span>User</span>
          <span>Role</span>
          <span>Action</span>
          <span>Module</span>
          <span className="col-span-2">Description</span>
        </div>

        {/* TABLE BODY */}
        <div className="max-h-[420px] overflow-y-auto">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-10 text-white/60">
              No audit logs found
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className="grid grid-cols-6 gap-4 px-6 py-4 text-sm border-t border-white/10 hover:bg-white/5 transition"
              >
                <span>{log.user}</span>
                <span className="text-white/70">{log.role}</span>
                <span className={`font-semibold ${actionColor[log.action]}`}>
                  {log.action}
                </span>
                <span>{log.module}</span>
                <span className="col-span-2 text-white/70">
                  {log.description}
                  <div className="text-xs text-white/40 mt-1">
                    {log.timestamp}
                  </div>
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;
