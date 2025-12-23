import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Building2,
  ShieldCheck,
  Pencil,
  Save,
  RotateCcw,
} from "lucide-react";

const StaffProfile = () => {
  const [editMode, setEditMode] = useState(false);

  const [profile, setProfile] = useState({
    name: "Dr. R. Kumar",
    role: "Counsellor",
    department: "Information Technology",
    designation: "Assistant Professor",
    email: "kumar@rmkec.ac.in",
    phone: "9876543210",
  });

  const [tempProfile, setTempProfile] = useState(profile);

  const handleEdit = () => {
    setTempProfile(profile);
    setEditMode(true);
  };

  const handleSave = () => {
    setProfile(tempProfile);
    setEditMode(false);
  };

  const handleReset = () => {
    setTempProfile(profile);
  };

  return (
    <div className="p-6 text-white">
      {/* ================= HEADER ================= */}
      <h1 className="text-2xl font-semibold mb-6">Staff Profile</h1>

      {/* ================= PROFILE CARD ================= */}
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 mb-6 flex gap-6 items-center">
        <div className="w-28 h-28 rounded-full bg-white/20 flex items-center justify-center text-4xl font-bold">
          RK
        </div>

        <div className="flex-1">
          <h2 className="text-xl font-semibold">{profile.name}</h2>
          <p className="text-[#00d3d1]">{profile.role}</p>
          <p className="text-sm text-white/70">{profile.department}</p>
        </div>
      </div>

      {/* ================= BASIC DETAILS ================= */}
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <User size={18} /> Basic Details
          </h3>

          {!editMode ? (
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 text-sm text-[#00d3d1]"
            >
              <Pencil size={16} /> Edit
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 text-sm text-green-400"
              >
                <Save size={16} /> Save
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 text-sm text-yellow-400"
              >
                <RotateCcw size={16} /> Reset
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            label="Name"
            value={tempProfile.name}
            disabled={!editMode}
            onChange={(v) =>
              setTempProfile({ ...tempProfile, name: v })
            }
          />

          <Field
            label="Designation"
            value={tempProfile.designation}
            disabled={!editMode}
            onChange={(v) =>
              setTempProfile({ ...tempProfile, designation: v })
            }
          />

          <Field
            label="Department"
            value={tempProfile.department}
            disabled={!editMode}
            onChange={(v) =>
              setTempProfile({ ...tempProfile, department: v })
            }
          />

          <Field
            label="Role"
            value={tempProfile.role}
            disabled
          />
        </div>
      </div>

      {/* ================= CONTACT DETAILS ================= */}
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <ShieldCheck size={18} /> Contact Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            icon={<Mail size={16} />}
            label="Official Email"
            value={tempProfile.email}
            disabled={!editMode}
            onChange={(v) =>
              setTempProfile({ ...tempProfile, email: v })
            }
          />

          <Field
            icon={<Phone size={16} />}
            label="Mobile Number"
            value={tempProfile.phone}
            disabled={!editMode}
            onChange={(v) =>
              setTempProfile({ ...tempProfile, phone: v })
            }
          />
        </div>
      </div>
    </div>
  );
};

/* ================= FIELD COMPONENT ================= */
const Field = ({ label, value, onChange, disabled, icon }) => {
  return (
    <div>
      <label className="text-sm text-white/70 mb-1 block">
        {label}
      </label>
      <div className="flex items-center gap-2 bg-black/30 border border-white/10 rounded-xl px-3 py-2">
        {icon}
        <input
          type="text"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange && onChange(e.target.value)}
          className="bg-transparent outline-none w-full text-white disabled:text-white/60"
        />
      </div>
    </div>
  );
};

export default StaffProfile;
