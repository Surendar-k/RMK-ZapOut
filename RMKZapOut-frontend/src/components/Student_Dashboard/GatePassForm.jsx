import { useState } from "react";

const GatepassForm = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [form, setForm] = useState({
    outgoingDate: "",
    returnDate: "",
    guardianPhone: "",
    guardianAddress: "",
  });

  const glass =
    "bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl";

  const totalDays =
    form.outgoingDate && form.returnDate
      ? Math.ceil(
          (new Date(form.returnDate) -
            new Date(form.outgoingDate)) /
            (1000 * 60 * 60 * 24)
        ) + 1
      : 0;

  return (
    <div className="min-h-screen w-full text-white bg-gradient-to-br from-[#020617] via-[#041b32] to-[#020617] px-10 py-6">

      <h1 className="text-3xl font-semibold mb-6">
        Apply <span className="text-cyan-400">Gate Pass</span>
      </h1>

      <div className={`${glass} p-8 max-w-4xl`}>
        <div className="grid grid-cols-2 gap-4">
          <input value={user.username} readOnly />
          <input value={user.student_type} readOnly />

          <input
            type="date"
            onChange={(e) =>
              setForm({ ...form, outgoingDate: e.target.value })
            }
          />

          <input
            type="date"
            onChange={(e) =>
              setForm({ ...form, returnDate: e.target.value })
            }
          />

          <input value={`Total Days: ${totalDays}`} readOnly />

          <input
            placeholder="Guardian Phone"
            onChange={(e) =>
              setForm({ ...form, guardianPhone: e.target.value })
            }
          />

          <textarea
            placeholder="Guardian Address"
            className="col-span-2"
            onChange={(e) =>
              setForm({ ...form, guardianAddress: e.target.value })
            }
          />
        </div>

        <button className="mt-6 px-6 py-3 bg-cyan-400 text-black rounded-xl font-semibold">
          Submit Gate Pass
        </button>
      </div>
    </div>
  );
};

export default GatepassForm;
