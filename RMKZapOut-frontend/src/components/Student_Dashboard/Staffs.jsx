import { Mail, Users } from "lucide-react";

const staffs = [
  {
    id: 1,
    name: "Dr. S. Kumar",
    role: "Counsellor",
    email: "kumar.counsellor@rmk.edu.in",
  },
  {
    id: 2,
    name: "Ms. R. Priya",
    role: "Branch Coordinator",
    email: "priya.coordinator@rmk.edu.in",
  },
  {
    id: 3,
    name: "Dr. V. Rajesh",
    role: "HOD",
    email: "rajesh.hod@rmk.edu.in",
  },
];

const Staffs = () => {
  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex items-center gap-3">
        <Users className="w-7 h-7 text-[#00d3d1]" />
        <h1 className="text-2xl font-semibold text-cyan-300">
          Staffs
        </h1>
      </div>

      {/* STAFF LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {staffs.map((staff) => (
          <div
            key={staff.id}
            className="rounded-2xl p-5 bg-white/10 backdrop-blur-xl border border-white/15 shadow-lg hover:bg-white/15 transition"
          >
            <div className="space-y-3">
              <div>
                <p className="text-lg font-semibold text-white">
                  {staff.name}
                </p>
                <p className="text-sm text-[#00d3d1]">
                  {staff.role}
                </p>
              </div>

              <div className="flex items-center gap-2 text-white/80 text-sm">
                <Mail className="w-4 h-4 text-[#00d3d1]" />
                <span>{staff.email}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Staffs;
