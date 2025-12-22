import { useState } from "react";

const userRole = "Student"; 

const quickHelpMap = {
  Student: [
    "How to apply Gate Pass",
    "How On-Duty works",
    "Approval flow explanation"
  ],
  Counsellor: [
    "How to review student requests",
    "Approval & rejection rules",
    "Emergency handling"
  ],
  Warden: [
    "QR scan verification",
    "Emergency exit handling",
    "Late return actions"
  ],
  Watchman: [
    "Gate QR scanning",
    "Manual verification steps",
    "Emergency exits"
  ]
};

export default function NeedHelp() {
  const [ticket, setTicket] = useState({
    type: "",
    message: "",
    file: null
  });

  const faqs = [
    {
      q: "Why was my request rejected?",
      a: "Your request may violate time, eligibility, or approval rules."
    },
    {
      q: "How long does approval take?",
      a: "Usually between 30 minutes to 2 hours depending on approvers."
    },
    {
      q: "Can I cancel a request?",
      a: "Yes, before final approval."
    }
  ];

  return (
    <div className="min-h-screen p-6 text-white bg-gradient-to-br from-[#0f172a] to-[#020617]">

      <h1 className="text-3xl font-semibold mb-6">Need Help</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <GlassCard title="Quick Help">
          {quickHelpMap[userRole]?.map((item, i) => (
            <p key={i} className="py-1">• {item}</p>
          ))}
        </GlassCard>

        <GlassCard title="Rules & Policies">
          <p>• Gate pass limits per week</p>
          <p>• OD eligibility criteria</p>
          <p className="text-red-300">• Late return consequences</p>
        </GlassCard>

        <GlassCard title="System Status">
          <p>Gate Pass System: <span className="text-green-400">Online</span></p>
          <p>QR Scanner: <span className="text-green-400">Active</span></p>
          <p>Approval Flow: <span className="text-green-400">Running</span></p>
        </GlassCard>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

        <GlassCard title="Contact Support">
          <Contact label="Counsellor" value="+91 98765 43210" />
          <Contact label="Warden" value="+91 91234 56789" />
          <Contact label="IT Support" value="support@rmk.edu.in" />
        </GlassCard>

        <GlassCard title="FAQs">
          {faqs.map((f, i) => (
            <details key={i} className="mb-2">
              <summary className="cursor-pointer font-medium">{f.q}</summary>
              <p className="text-sm opacity-80 mt-1">{f.a}</p>
            </details>
          ))}
        </GlassCard>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

        <GlassCard title="Raise Support Ticket">
          <select
            className="w-full p-2 mb-3 bg-transparent border rounded"
            value={ticket.type}
            onChange={(e) => setTicket({ ...ticket, type: e.target.value })}
          >
            <option value="">Select Issue Type</option>
            <option>Gate Pass Issue</option>
            <option>On-Duty Issue</option>
            <option>QR Issue</option>
            <option>Other</option>
          </select>

          <textarea
            className="w-full p-2 mb-3 bg-transparent border rounded"
            rows="4"
            placeholder="Describe your issue"
            value={ticket.message}
            onChange={(e) => setTicket({ ...ticket, message: e.target.value })}
          />

          <input
            type="file"
            className="mb-3"
            onChange={(e) => setTicket({ ...ticket, file: e.target.files[0] })}
          />

          <button className="w-full py-2 bg-blue-600 rounded hover:bg-blue-700">
            Submit Ticket
          </button>
        </GlassCard>

        <GlassCard title="Emergency Help">
          <p className="mb-4 text-red-300">
            Use only in real emergency situations
          </p>
          <button className="w-full py-3 bg-red-600 rounded hover:bg-red-700 text-lg">
            🚨 Emergency Exit Request
          </button>
        </GlassCard>

      </div>

    </div>
  );
}

function GlassCard({ title, children }) {
  return (
    <div className="p-5 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg">
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      {children}
    </div>
  );
}

function Contact({ label, value }) {
  return (
    <div className="flex justify-between items-center mb-2">
      <span>{label}</span>
      <span className="text-blue-300">{value}</span>
    </div>
  );
}
