import { ShieldCheck } from "lucide-react";

const rolesData = [
  {
    role: "Student",
    permissions: [
      "Apply Gate Pass",
      "Apply On-Duty",
      "View Request Status",
      "View Notifications",
    ],
  },
  {
    role: "Counsellor",
    permissions: [
      "Approve / Reject Requests",
      "View Student Profiles",
      "Call Parents",
    ],
  },
  {
    role: "Branch Coordinator",
    permissions: [
      "Verify Requests",
      "View Department Students",
    ],
  },
  {
    role: "HOD",
    permissions: [
      "Final Approval",
      "View Reports",
      "Override Decisions",
    ],
  },
  {
    role: "Warden",
    permissions: [
      "Verify Hostel Gate Pass",
      "Mark Student Exit / Entry",
    ],
  },
  {
    role: "Watchman",
    permissions: [
      "Scan QR Code",
      "Log Entry & Exit",
    ],
  },
];

const RolesPermissions = () => {
  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-semibold mb-8 flex items-center gap-3">
        <ShieldCheck className="text-[#00d3d1]" />
        Roles & Permissions
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {rolesData.map((roleItem, index) => (
          <div
            key={index}
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-[1.02] transition-all"
          >
            <h2 className="text-xl font-semibold mb-4 text-[#00d3d1]">
              {roleItem.role}
            </h2>

            <ul className="space-y-2 text-sm text-white/80">
              {roleItem.permissions.map((permission, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg"
                >
                  <span className="w-2 h-2 rounded-full bg-[#00d3d1]" />
                  {permission}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RolesPermissions;
