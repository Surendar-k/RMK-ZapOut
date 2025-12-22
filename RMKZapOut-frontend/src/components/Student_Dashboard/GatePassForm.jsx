import { useEffect, useState } from "react";
import axios from "axios";

const GatepassForm = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [form, setForm] = useState({
    outDate: "",
    returnDate: "",
    totalDays: 0,
    purpose: "",
    guardianName: "",
    guardianPhone: "",
    guardianAddress: "",
  });

  const glass =
    "bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl";

  /* ================= AUTO CALCULATE TOTAL DAYS ================= */
  useEffect(() => {
    if (form.outDate && form.returnDate) {
      const parseDate = (value) => {
        const [dd, mm, yyyy] = value.split("/");
        return new Date(`${yyyy}-${mm}-${dd}`);
      };

      try {
        const start = parseDate(form.outDate);
        const end = parseDate(form.returnDate);
        const diff =
          Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

        setForm((prev) => ({
          ...prev,
          totalDays: diff > 0 ? diff : 0,
        }));
      } catch {
        setForm((prev) => ({ ...prev, totalDays: 0 }));
      }
    }
  }, [form.outDate, form.returnDate]);

  /* ================= VALIDATION ================= */
  const isFormValid =
    form.outDate &&
    form.returnDate &&
    form.totalDays > 0 &&
    form.purpose &&
    form.guardianName &&
    form.guardianPhone &&
    form.guardianAddress;

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:5000/api/gatepass/apply", {
        studentId: user.id,
        outDate: form.outDate,
        returnDate: form.returnDate,
        totalDays: form.totalDays,
        reason: form.purpose,

        guardian: {
          name: form.guardianName,
          phone: form.guardianPhone,
          address: form.guardianAddress,
        },

        parents: {
          fatherName: user.father_name,
          fatherPhone: user.father_phone,
          motherName: user.mother_name,
          motherPhone: user.mother_phone,
        },
      });

      alert("Gate Pass request submitted successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to submit Gate Pass request");
    }
  };

  return (
    <div className="min-h-screen w-full text-white bg-gradient-to-br from-[#020617] via-[#041b32] to-[#020617] px-10 py-6">

      <h1 className="text-3xl font-semibold mb-6">
        Apply <span className="text-cyan-400">Gate Pass</span>
      </h1>

      <div className="max-w-5xl space-y-6">

        {/* ================= STUDENT DETAILS ================= */}
        <div className={`${glass} p-6`}>
          <h2 className="text-lg font-semibold text-cyan-400 mb-4">
            Student Details
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <ReadOnly label="Student Name" value={user.username} />
            <ReadOnly label="Register Number" value={user.register_number || "—"} />
            <ReadOnly label="Department" value={user.department || "—"} />
            <ReadOnly label="Year of Study" value={user.year || "—"} />
            <ReadOnly label="Hostel Name" value={user.hostel_name || "—"} />
            <ReadOnly label="Room Number" value={user.room_no || "—"} />
          </div>
        </div>

        {/* ================= OUTING DETAILS ================= */}
        <div className={`${glass} p-6`}>
          <h2 className="text-lg font-semibold text-cyan-400 mb-4">
            Outing Details <span className="text-red-400">*</span>
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <TextDateInput
              label="Date of Departure *"
              placeholder="dd/mm/yyyy"
              onChange={(e) =>
                setForm({ ...form, outDate: e.target.value })
              }
            />
            <TextDateInput
              label="Expected Date of Return *"
              placeholder="dd/mm/yyyy"
              onChange={(e) =>
                setForm({ ...form, returnDate: e.target.value })
              }
            />
            <ReadOnly
              label="Total Number of Days"
              value={form.totalDays}
            />
          </div>

          <div className="mt-4">
            <Textarea
              label="Purpose of Outing *"
              onChange={(e) =>
                setForm({ ...form, purpose: e.target.value })
              }
            />
          </div>
        </div>

        {/* ================= PARENTS DETAILS ================= */}
        <div className={`${glass} p-6`}>
          <h2 className="text-lg font-semibold text-cyan-400 mb-4">
            Parents Details (For Verification)
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <ReadOnly label="Father’s Name" value={user.father_name || "—"} />
            <ReadOnly label="Father’s Mobile Number" value={user.father_phone || "—"} />
            <ReadOnly label="Mother’s Name" value={user.mother_name || "—"} />
            <ReadOnly label="Mother’s Mobile Number" value={user.mother_phone || "—"} />
          </div>
        </div>

        {/* ================= GUARDIAN DETAILS ================= */}
        <div className={`${glass} p-6`}>
          <h2 className="text-lg font-semibold text-cyan-400 mb-4">
            Local Guardian Details <span className="text-red-400">*</span>
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <TextInput
              label="Guardian’s Full Name *"
              onChange={(e) =>
                setForm({ ...form, guardianName: e.target.value })
              }
            />
            <TextInput
              label="Guardian’s Mobile Number *"
              onChange={(e) =>
                setForm({ ...form, guardianPhone: e.target.value })
              }
            />
            <Textarea
              label="Guardian’s Residential Address *"
              onChange={(e) =>
                setForm({ ...form, guardianAddress: e.target.value })
              }
            />
          </div>
        </div>

        {/* ================= SUBMIT ================= */}
        <div>
          <button
            disabled={!isFormValid}
            onClick={handleSubmit}
            className={`px-8 py-3 rounded-xl font-semibold transition ${
              isFormValid
                ? "bg-cyan-400 text-black hover:scale-105"
                : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
            }`}
          >
            Submit Gate Pass Request
          </button>
        </div>

      </div>
    </div>
  );
};

/* ================= SMALL COMPONENTS ================= */

const ReadOnly = ({ label, value }) => (
  <div>
    <label className="text-sm text-gray-300 mb-1 block">{label}</label>
    <input
      readOnly
      value={value}
      className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-gray-300"
    />
  </div>
);

const TextInput = ({ label, onChange }) => (
  <div>
    <label className="text-sm text-gray-300 mb-1 block">{label}</label>
    <input
      onChange={onChange}
      className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white"
    />
  </div>
);

const TextDateInput = ({ label, placeholder, onChange }) => (
  <div>
    <label className="text-sm text-gray-300 mb-1 block">{label}</label>
    <input
      type="text"
      placeholder={placeholder}
      onChange={onChange}
      className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white"
    />
  </div>
);

const Textarea = ({ label, onChange }) => (
  <div>
    <label className="text-sm text-gray-300 mb-1 block">{label}</label>
    <textarea
      rows={3}
      onChange={onChange}
      className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white"
    />
  </div>
);

export default GatepassForm;
