import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Activity, LogOut } from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
      isActive
        ? "bg-signal/10 text-signal"
        : "text-slate hover:text-offwhite hover:bg-white/5"
    }`;

  return (
    <aside className="w-56 h-screen bg-panel border-r border-white/5 flex flex-col p-4">
      <div className="font-display text-lg text-offwhite px-3 mb-8">
        PulseWatch
      </div>

      <nav className="flex-1 space-y-1">
        <NavLink to="/dashboard" className={linkClass}>
          <LayoutDashboard size={18} />
          Overview
        </NavLink>
        <NavLink to="/monitors" className={linkClass}>
          <Activity size={18} />
          Monitors
        </NavLink>
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate hover:text-alert hover:bg-white/5 transition"
      >
        <LogOut size={18} />
        Log out
      </button>
    </aside>
  );
}