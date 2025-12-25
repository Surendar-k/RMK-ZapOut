import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Pencil,
  Save,
  RotateCcw,
} from "lucide-react";
import {
  fetchStaffProfile,
  updateStaffProfile,
} from "../../services/staffProfileService.jsx";

const StaffProfile = () => {
  const sessionUser = JSON.parse(localStorage.getItem("user")); // { id, role }

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState(null);
  const [tempProfile, setTempProfile] = useState(null);

  /* ================= FETCH PROFILE ================= */
  const loadProfile = async () => {
    try {
      const res = await fetchStaffProfile(sessionUser.id);
      setProfile(res.data.profile);
      setTempProfile(res.data.profile);
    } catch (err) {
      console.error("Profile fetch failed", err);
      alert("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sessionUser?.id) loadProfile();
  }, [sessionUser?.id]);

  /* ================= ACTIONS ================= */
  const handleEdit = () => {
    setTempProfile(profile);
    setEditMode(true);
  };

  const handleSave = async () => {
    try {
      await updateStaffProfile(sessionUser.id, tempProfile);
      setProfile(tempProfile);
      setEditMode(false);
      alert("Profile updated successfully");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  const handleReset = () => {
    setTempProfile(profile);
  };

  if (loading) return <p className="p-6 text-white">Loading profile…</p>;
  if (!profile) return null;

  return (
    <div className="p-6 text-white">
      {/* ================= HEADER ================= */}
      <h1 className="text-2xl font-semibold mb-6">Staff Profile</h1>

      {/* ================= PROFILE CARD ================= */}
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 mb-6 flex gap-6 items-center">
        <div className="w-28 h-28 rounded-full bg-white/20 flex items-center justify-center text-4xl font-bold">
          {profile.username?.charAt(0)}
        </div>

        <div className="flex-1">
          <h2 className="text-xl font-semibold">{profile.username}</h2>
          <p className="text-[#00d3d1]">{profile.role}</p>
          <p className="text-sm text-white/70">{profile.department || "-"}</p>
          {profile.designation && (
            <p className="text-sm text-white/70">{profile.designation}</p>
          )}
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
            value={tempProfile.username}
            disabled={!editMode}
            onChange={(v) => setTempProfile({ ...tempProfile, username: v })}
          />

          <Field
            label="Department"
            value={tempProfile.department || ""}
            disabled={!editMode}
            onChange={(v) => setTempProfile({ ...tempProfile, department: v })}
          />

          <Field
            label="Designation"
            value={tempProfile.designation || ""}
            disabled={!editMode}
            onChange={(v) =>
              setTempProfile({ ...tempProfile, designation: v })
            }
          />

          <Field label="Role" value={tempProfile.role} disabled />
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
            onChange={(v) => setTempProfile({ ...tempProfile, email: v })}
          />

          <Field
            icon={<Phone size={16} />}
            label="Mobile Number"
            value={tempProfile.phone || ""}
            disabled={!editMode}
            onChange={(v) => setTempProfile({ ...tempProfile, phone: v })}
          />
        </div>
      </div>
    </div>
  );
};

/* ================= FIELD ================= */
const Field = ({ label, value, onChange, disabled, icon }) => (
  <div>
    <label className="text-sm text-white/70 mb-1 block">{label}</label>
    <div className="flex items-center gap-2 bg-black/30 border border-white/10 rounded-xl px-3 py-2">
      {icon}
      <input
        type="text"
        value={value || ""}
        disabled={disabled}
        onChange={(e) => onChange && onChange(e.target.value)}
        className="bg-transparent outline-none w-full text-white disabled:text-white/60"
      />
    </div>
  </div>
);

export default StaffProfile;
