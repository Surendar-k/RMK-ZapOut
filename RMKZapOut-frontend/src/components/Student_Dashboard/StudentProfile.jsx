import { useState } from "react";
import {
  Edit,
  Save,
  RotateCcw,
  Camera,
  AlertTriangle,
  Phone,
} from "lucide-react";

import qrSample from "../../assets/sample-qr.png";

const glass =
  "bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl";

const StudentProfile = () => {
  const [editBasic, setEditBasic] = useState(false);
  const [editContact, setEditContact] = useState(false);
  const [editParents, setEditParents] = useState(false);

  const [errorBasic, setErrorBasic] = useState("");
  const [errorContact, setErrorContact] = useState("");
  const [errorParents, setErrorParents] = useState("");

  const initialData = {
    photo: null,
    name: "",
    roll: "",
    dept: "",
    section: "",
    year: "",
    type: "",
    hostel: "",
    bus: "",
    mobile: "",
    collegeEmail: "",
    personalEmail: "",
    counsellorName: "",
    counsellorMobile: "",
    fatherName: "",
    fatherMobile: "",
    motherName: "",
    motherMobile: "",
    guardianName: "",
    guardianMobile: "",
  };

  const [form, setForm] = useState(initialData);
  const [saved, setSaved] = useState(initialData);

  /* ================= VALIDATION ================= */

  const validateBasic = () => {
    if (
      !form.photo ||
      !form.name ||
      !form.roll ||
      !form.dept ||
      !form.section ||
      !form.year ||
      !form.type
    )
      return false;

    if (form.type === "Hosteller" && !form.hostel) return false;
    if (form.type === "Day Scholar" && !form.bus) return false;

    return true;
  };

  const validateContact = () => {
    if (
      !form.mobile ||
      !form.collegeEmail ||
      !form.counsellorName ||
      !form.counsellorMobile
    )
      return false;

    return true;
  };

  const validateParents = () => {
    if (
      !form.fatherName ||
      !form.fatherMobile ||
      !form.motherName ||
      !form.motherMobile
    )
      return false;

    return true;
  };

  /* ================= SAVE ================= */

  const saveBasic = () => {
    if (!validateBasic()) {
      setErrorBasic("Profile photo & all required fields are mandatory");
      return;
    }
    setSaved({ ...saved, ...form });
    setEditBasic(false);
    setErrorBasic("");
  };

  const saveContact = () => {
    if (!validateContact()) {
      setErrorContact("Counsellor details & contact fields are mandatory");
      return;
    }
    setSaved({ ...saved, ...form });
    setEditContact(false);
    setErrorContact("");
  };

  const saveParents = () => {
    if (!validateParents()) {
      setErrorParents("Please fill all required parent details");
      return;
    }
    setSaved({ ...saved, ...form });
    setEditParents(false);
    setErrorParents("");
  };

  const resetSection = (section) => {
    setForm({ ...form, ...saved });

    if (section === "basic") {
      setEditBasic(false);
      setErrorBasic("");
    }
    if (section === "contact") {
      setEditContact(false);
      setErrorContact("");
    }
    if (section === "parents") {
      setEditParents(false);
      setErrorParents("");
    }
  };

  return (
    <div
      className="relative h-screen w-full overflow-hidden text-white
      bg-gradient-to-br from-[#020617] via-[#041b32] to-[#020617]"
    >
      <div className="h-full px-10 py-6 overflow-y-auto">
        <div className="grid grid-cols-2 gap-8">

          {/* ================= BASIC ================= */}
          <div className={`${glass} p-6`}>
            <Header
              title="Basic Information"
              editing={editBasic}
              onEdit={() => setEditBasic(true)}
              onSave={saveBasic}
              onReset={() => resetSection("basic")}
            />

            {errorBasic && <Error text={errorBasic} />}

            <div className="flex justify-between mb-6">
              <label className="cursor-pointer">
                <input
                  type="file"
                  hidden
                  disabled={!editBasic}
                  accept="image/*"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      photo: URL.createObjectURL(e.target.files[0]),
                    })
                  }
                />
                <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
                  {form.photo ? (
                    <img
                      src={form.photo}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Camera />
                  )}
                </div>
              </label>

              <img src={qrSample} className="w-24 h-24" />
            </div>

            <BasicFields editing={editBasic} form={form} setForm={setForm} />
          </div>

          {/* ================= RIGHT ================= */}
          <div className="flex flex-col gap-8">

            {/* CONTACT */}
            <div className={`${glass} p-6`}>
              <Header
                title="Student Contact Details"
                editing={editContact}
                onEdit={() => setEditContact(true)}
                onSave={saveContact}
                onReset={() => resetSection("contact")}
              />

              {errorContact && <Error text={errorContact} />}

              {/* FORM (locked when not editing) */}
              <ContactFields
                editing={editContact}
                form={form}
                setForm={setForm}
              />

              {/* ✅ CALL BUTTON ALWAYS ENABLED */}
              {form.counsellorMobile && (
                <a
                  href={`tel:${form.counsellorMobile}`}
                  className="mt-4 inline-flex items-center gap-2
                  bg-green-500/20 border border-green-500/40
                  px-4 py-2 rounded-lg text-green-300"
                >
                  <Phone size={14} /> Call Counsellor
                </a>
              )}
            </div>

            {/* PARENTS */}
            <div className={`${glass} p-6`}>
              <Header
                title="Parents & Guardian"
                editing={editParents}
                onEdit={() => setEditParents(true)}
                onSave={saveParents}
                onReset={() => resetSection("parents")}
              />

              {errorParents && <Error text={errorParents} />}

              <ParentsFields
                editing={editParents}
                form={form}
                setForm={setForm}
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

/* ================= REUSABLE ================= */

const Header = ({ title, editing, onEdit, onSave, onReset }) => (
  <div className="flex justify-between mb-6">
    <h3 className="text-lg font-semibold">{title}</h3>
    {!editing ? (
      <button
        onClick={onEdit}
        className="flex items-center gap-2 text-cyan-400"
      >
        <Edit size={16} /> Edit
      </button>
    ) : (
      <div className="flex gap-4">
        <button
          onClick={onSave}
          className="flex items-center gap-2 text-green-400"
        >
          <Save size={16} /> Save
        </button>
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-red-400"
        >
          <RotateCcw size={16} /> Reset
        </button>
      </div>
    )}
  </div>
);

const Error = ({ text }) => (
  <div className="mb-4 flex items-center gap-2 text-red-400">
    <AlertTriangle size={16} /> {text}
  </div>
);

const BasicFields = ({ editing, form, setForm }) => (
  <div className={`${editing ? "" : "pointer-events-none opacity-60"} space-y-4`}>
    <Input label="Full Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
    <Input label="Roll Number" required value={form.roll} onChange={(e) => setForm({ ...form, roll: e.target.value })} />
    <Input label="Department" required value={form.dept} onChange={(e) => setForm({ ...form, dept: e.target.value })} />
    <Input label="Section" required value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })} />
    <Input label="Year / Semester" required value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />

    <Select
      label="Student Type"
      required
      value={form.type}
      onChange={(e) =>
        setForm({ ...form, type: e.target.value, hostel: "", bus: "" })
      }
      options={["", "Day Scholar", "Hosteller"]}
    />

    {form.type === "Hosteller" && (
      <Input label="Hostel & Room No" required value={form.hostel} onChange={(e) => setForm({ ...form, hostel: e.target.value })} />
    )}
    {form.type === "Day Scholar" && (
      <Input label="Bus Stop & Bus No" required value={form.bus} onChange={(e) => setForm({ ...form, bus: e.target.value })} />
    )}
  </div>
);

const ContactFields = ({ editing, form, setForm }) => (
  <div className={`${editing ? "" : "pointer-events-none opacity-60"} space-y-4`}>
    <Input label="Mobile Number" required value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} />
    <Input label="College Email ID" required value={form.collegeEmail} onChange={(e) => setForm({ ...form, collegeEmail: e.target.value })} />
    <Input label="Personal Email" value={form.personalEmail} onChange={(e) => setForm({ ...form, personalEmail: e.target.value })} />
    <Divider />
    <Input label="Counsellor Name" required value={form.counsellorName} onChange={(e) => setForm({ ...form, counsellorName: e.target.value })} />
    <Input label="Counsellor Phone Number" required value={form.counsellorMobile} onChange={(e) => setForm({ ...form, counsellorMobile: e.target.value })} />
  </div>
);

const ParentsFields = ({ editing, form, setForm }) => (
  <div className={`${editing ? "" : "pointer-events-none opacity-60"} space-y-4`}>
    <Input label="Father Name" required value={form.fatherName} onChange={(e) => setForm({ ...form, fatherName: e.target.value })} />
    <Input label="Father Mobile" required value={form.fatherMobile} onChange={(e) => setForm({ ...form, fatherMobile: e.target.value })} />
    <Divider />
    <Input label="Mother Name" required value={form.motherName} onChange={(e) => setForm({ ...form, motherName: e.target.value })} />
    <Input label="Mother Mobile" required value={form.motherMobile} onChange={(e) => setForm({ ...form, motherMobile: e.target.value })} />
    <Divider />
    <Input label="Guardian Name" value={form.guardianName} onChange={(e) => setForm({ ...form, guardianName: e.target.value })} />
    <Input label="Guardian Mobile" value={form.guardianMobile} onChange={(e) => setForm({ ...form, guardianMobile: e.target.value })} />
  </div>
);

const Input = ({ label, required, ...props }) => (
  <div>
    <label className="text-sm text-gray-300">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    <input
      {...props}
      className="w-full mt-1 bg-white/5 border border-white/20
      text-white rounded-lg p-2 outline-none"
    />
  </div>
);

const Select = ({ label, options, required, ...props }) => (
  <div>
    <label className="text-sm text-gray-300">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    <select
      {...props}
      className="w-full mt-1 bg-[#0b1220] text-white
      border border-white/20 rounded-lg p-2"
    >
      {options.map((o, i) => (
        <option key={i} value={o}>
          {o || "Select"}
        </option>
      ))}
    </select>
  </div>
);

const Divider = () => <div className="h-px bg-white/15 my-4" />;

export default StudentProfile;
