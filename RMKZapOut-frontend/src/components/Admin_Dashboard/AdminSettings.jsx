import { useState } from "react";
import {
  Shield,
  Bell,
  Palette,
  Save,
  RotateCcw,
  Lock,
} from "lucide-react";

const GlassCard = ({ title, icon, children }) => (
  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-lg">
    <div className="flex items-center gap-3 mb-4">
      {icon}
      <h2 className="text-lg font-semibold text-white">{title}</h2>
    </div>
    {children}
  </div>
);

const Toggle = ({ label, value, onChange }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm text-white/80">{label}</span>
    <button
      onClick={onChange}
      className={`w-12 h-6 rounded-full transition-all ${
        value ? "bg-cyan-400" : "bg-white/20"
      }`}
    >
      <div
        className={`w-5 h-5 bg-white rounded-full shadow-md transition-all ${
          value ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  </div>
);

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    twoFactor: true,
    emailNotify: true,
    smsNotify: false,
    darkMode: true,
    auditLogs: true,
  });

  const toggle = (key) =>
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="p-8 space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-red-500">Settings</h1>
        <p className="text-white/60 text-sm">
          Manage system preferences and security controls
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* SECURITY */}
        <GlassCard
          title="Security"
          icon={<Shield className="text-cyan-400" />}
        >
          <div className="space-y-4">
            <Toggle
              label="Two-Factor Authentication"
              value={settings.twoFactor}
              onChange={() => toggle("twoFactor")}
            />
            <Toggle
              label="Enable Audit Logs"
              value={settings.auditLogs}
              onChange={() => toggle("auditLogs")}
            />
            <div className="flex items-center gap-2 text-xs text-white/60 mt-2">
              <Lock size={14} />
              Changes affect all admin users
            </div>
          </div>
        </GlassCard>

        {/* NOTIFICATIONS */}
        <GlassCard
          title="Notifications"
          icon={<Bell className="text-cyan-400" />}
        >
          <div className="space-y-4">
            <Toggle
              label="Email Notifications"
              value={settings.emailNotify}
              onChange={() => toggle("emailNotify")}
            />
            <Toggle
              label="SMS Alerts"
              value={settings.smsNotify}
              onChange={() => toggle("smsNotify")}
            />
          </div>
        </GlassCard>

        {/* APPEARANCE */}
        <GlassCard
          title="Appearance"
          icon={<Palette className="text-cyan-400" />}
        >
          <div className="space-y-4">
            <Toggle
              label="Dark Mode"
              value={settings.darkMode}
              onChange={() => toggle("darkMode")}
            />
            <p className="text-xs text-white/60">
              Applies across admin dashboard
            </p>
          </div>
        </GlassCard>

        {/* SYSTEM */}
        <GlassCard
          title="System Controls"
          icon={<Shield className="text-cyan-400" />}
        >
          <div className="space-y-3 text-sm text-white/80">
            <p>• Role-based access control</p>
            <p>• Department-level permissions</p>
            <p>• Request approval workflow</p>
          </div>
        </GlassCard>
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-4">
        <button className="flex items-center gap-2 px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition">
          <RotateCcw size={18} />
          Reset
        </button>
        <button className="flex items-center gap-2 px-6 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold transition">
          <Save size={18} />
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;
