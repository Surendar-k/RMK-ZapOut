import { useState } from "react";

const OnDutyForm = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [form, setForm] = useState({
    eventType: "",
    eventName: "",
    college: "",
    location: "",
    fromDate: "",
    toDate: "",
    proof: null,
  });

  const glass =
    "bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl";

  const isPlacement = form.eventType === "Placement";

  const isFormValid =
    form.eventType &&
    form.eventName &&
    form.college &&
    form.location &&
    form.fromDate &&
    form.toDate &&
    (isPlacement || form.proof);

  return (
    <div className="min-h-screen w-full text-white bg-gradient-to-br from-[#020617] via-[#041b32] to-[#020617] px-10 py-6">

      {/* TITLE */}
      <h1 className="text-3xl font-semibold mb-6">
        Apply <span className="text-cyan-400">On-Duty</span>
      </h1>

      <div className="max-w-5xl space-y-6">

        {/* ================= STUDENT DETAILS ================= */}
        <div className={`${glass} p-6`}>
          <h2 className="text-lg font-semibold mb-4 text-cyan-400">
            Student Details
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <ReadOnlyInput label="Student Name" value={user.username} />
            <ReadOnlyInput label="Student Type" value={user.student_type} />
            <ReadOnlyInput label="Register Number" value={user.register_number || "—"} />
            <ReadOnlyInput label="Department" value={user.department || "—"} />
            <ReadOnlyInput label="Year" value={user.year || "—"} />
            <ReadOnlyInput label="Email" value={user.email || "—"} />
          </div>
        </div>

        {/* ================= EVENT DETAILS ================= */}
        <div className={`${glass} p-6`}>
          <h2 className="text-lg font-semibold mb-4 text-cyan-400">
            Event Details
          </h2>

          <div className="grid grid-cols-2 gap-4">

            {/* EVENT TYPE */}
            <SelectInput
              label="Event Type"
              value={form.eventType}
              options={[
                "Hackathon",
                "Symposium",
                "Workshop",
                "Placement",
                "Conference",
                "Others",
              ]}
              onChange={(e) =>
                setForm({ ...form, eventType: e.target.value, proof: null })
              }
            />

            <TextInput
              label="Event Name"
              placeholder="Enter event name"
              onChange={(e) =>
                setForm({ ...form, eventName: e.target.value })
              }
            />

            <TextInput
              label="College / Organization"
              placeholder="Enter college name"
              onChange={(e) =>
                setForm({ ...form, college: e.target.value })
              }
            />

            <TextInput
              label="Event Location"
              placeholder="Enter location"
              onChange={(e) =>
                setForm({ ...form, location: e.target.value })
              }
            />

            <DateInput
              label="From Date (dd/mm/yyyy)"
              onChange={(e) =>
                setForm({ ...form, fromDate: e.target.value })
              }
            />

            <DateInput
              label="To Date (dd/mm/yyyy)"
              onChange={(e) =>
                setForm({ ...form, toDate: e.target.value })
              }
            />

          </div>
        </div>

        {/* ================= PROOF UPLOAD ================= */}
        {!isPlacement && (
          <div className={`${glass} p-6`}>
            <h2 className="text-lg font-semibold mb-4 text-cyan-400">
              Proof Upload
            </h2>

            <label className="block cursor-pointer">
              <div className="bg-white/5 border border-dashed border-white/30 rounded-xl px-6 py-5 hover:bg-white/10 transition">
                <p className="text-gray-300">
                  {form.proof ? form.proof.name : "Upload proof document"}
                </p>
              </div>

              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) =>
                  setForm({ ...form, proof: e.target.files[0] })
                }
              />
            </label>

            {/* PREVIEW */}
            {form.proof && (
              <div className="mt-4">
                {form.proof.type.startsWith("image/") ? (
                  <img
                    src={URL.createObjectURL(form.proof)}
                    alt="Preview"
                    className="w-40 rounded-lg border border-white/20"
                  />
                ) : (
                  <p className="text-sm text-gray-400">
                    Selected file: {form.proof.name}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* ================= SUBMIT ================= */}
        <div className="pt-2">
          <button
            disabled={!isFormValid}
            className={`px-8 py-3 rounded-xl font-semibold transition ${
              isFormValid
                ? "bg-cyan-400 text-black hover:scale-105"
                : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
            }`}
          >
            Submit On-Duty
          </button>
        </div>

      </div>
    </div>
  );
};

/* ================= SMALL COMPONENTS ================= */

const ReadOnlyInput = ({ label, value }) => (
  <div>
    <label className="text-sm text-gray-300 mb-1 block">{label}</label>
    <input
      value={value}
      readOnly
      className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-gray-300"
    />
  </div>
);

const TextInput = ({ label, placeholder, onChange }) => (
  <div>
    <label className="text-sm text-gray-300 mb-1 block">{label}</label>
    <input
      placeholder={placeholder}
      onChange={onChange}
      className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white"
    />
  </div>
);

const DateInput = ({ label, onChange }) => (
  <div>
    <label className="text-sm text-gray-300 mb-1 block">{label}</label>
    <input
      type="date"
      onChange={onChange}
      className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white"
    />
  </div>
);

const SelectInput = ({ label, value, options, onChange }) => (
  <div>
    <label className="text-sm text-gray-300 mb-1 block">{label}</label>
    <select
      value={value}
      onChange={onChange}
      className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white"
    >
      <option value="">Select</option>
      {options.map((opt) => (
        <option key={opt} value={opt} className="text-black">
          {opt}
        </option>
      ))}
    </select>
  </div>
);

export default OnDutyForm;
