import { useState } from "react";

export default function NeedHelp() {
  const [ticket, setTicket] = useState({
    issueType: "",
    message: "",
    file: null,
  });

  return (
    <div className="min-h-screen p-6 text-white bg-gradient-to-br from-[#0f172a] to-[#020617]">

      <h1 className="text-3xl font-semibold mb-6">Need Help</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <GlassCard title="Quick Help">
          <AccordionItem
            title="How to apply Gate Pass"
            content="Go to Dashboard → Apply Gate Pass → Fill details → Submit."
          />
          <AccordionItem
            title="How On-Duty works"
            content="Apply OD → Approval → QR generated → Exit allowed."
          />
          <AccordionItem
            title="Approval flow explanation"
            content="Student → Counsellor → HOD → Warden → Exit."
          />
        </GlassCard>

        <GlassCard title="Rules & Policies">
          <AccordionItem
            title="Gate pass limits"
            content="Gate passes are limited per week as per policy."
          />
          <AccordionItem
            title="On-duty eligibility"
            content="Only eligible students with valid reasons can apply."
          />
          <AccordionItem
            title="Late return consequences"
            content="Late returns may lead to warnings or restrictions."
            danger
          />
        </GlassCard>

        <GlassCard title="Contact Support">
          <Contact label="Counsellor" value="+91 98765 43210" />
          <Contact label="Warden" value="+91 91234 56789" />
          <Contact label="IT Support" value="support@rmk.edu.in" />
        </GlassCard>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

        <GlassCard title="FAQs">
          <AccordionItem
            title="Why was my request rejected?"
            content="It may violate eligibility, timing, or approval rules."
          />
          <AccordionItem
            title="How long does approval take?"
            content="Usually between 30 minutes to 2 hours."
          />
          <AccordionItem
            title="Can I cancel a request?"
            content="Yes, before final approval."
          />
        </GlassCard>

        <GlassCard title="Raise Support Ticket">
          <select
            className="w-full p-2 mb-3 bg-transparent border border-white/20 rounded outline-none"
            value={ticket.issueType}
            onChange={(e) =>
              setTicket({ ...ticket, issueType: e.target.value })
            }
          >
            <option value="">Select Issue Type</option>
            <option>Gate Pass Issue</option>
            <option>On-Duty Issue</option>
            <option>Approval Delay</option>
            <option>Other</option>
          </select>

          <textarea
            className="w-full p-2 mb-4 bg-transparent border border-white/20 rounded outline-none"
            rows="4"
            placeholder="Describe your issue"
            value={ticket.message}
            onChange={(e) =>
              setTicket({ ...ticket, message: e.target.value })
            }
          />

          <label className="block mb-4 cursor-pointer">
            <div className="flex items-center justify-center gap-3 p-4 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition">
              <span className="text-2xl">📎</span>
              <span className="text-sm">
                {ticket.file ? ticket.file.name : "Upload Screenshot"}
              </span>
            </div>

            <input
              type="file"
              className="hidden"
              onChange={(e) =>
                setTicket({ ...ticket, file: e.target.files[0] })
              }
            />
          </label>

          <button className="w-full py-2 bg-blue-600 rounded hover:bg-blue-700 transition">
            Submit Ticket
          </button>
        </GlassCard>

      </div>

      <div className="mt-6">
        <GlassCard title="Emergency Help">
          <p className="mb-4 text-red-300">
            Use only in genuine emergency situations
          </p>
          <button className="w-full py-3 bg-red-600 rounded hover:bg-red-700 transition text-lg">
            🚨 Emergency Exit Request
          </button>
        </GlassCard>
      </div>

    </div>
  );
}

function AccordionItem({ title, content, danger }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-3 border border-white/20 rounded">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-3 py-2 flex justify-between items-center"
      >
        <span className={danger ? "text-red-300" : ""}>{title}</span>
        <span className="text-xl">{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div className="px-3 pb-3 text-sm opacity-80">
          {content}
        </div>
      )}
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
