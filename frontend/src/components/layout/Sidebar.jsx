import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Activity, LogOut, Menu, X } from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

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

  const navContent = (
    <>
      <div className="font-display text-lg text-offwhite px-3 mb-8">
        PulseWatch
      </div>

      <nav className="flex-1 space-y-1">
        <NavLink to="/dashboard" className={linkClass} onClick={() => setMobileOpen(false)}>
          <LayoutDashboard size={18} />
          Overview
        </NavLink>
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate hover:text-alert hover:bg-white/5 transition"
      >
        <LogOut size={18} />
        Log out
      </button>
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between bg-panel border-b border-white/5 px-4 py-3">
        <span className="font-display text-offwhite">PulseWatch</span>
        <button onClick={() => setMobileOpen(true)} className="text-offwhite">
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile slide-out drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="w-64 h-full bg-panel border-r border-white/5 flex flex-col p-4">
            <button
              onClick={() => setMobileOpen(false)}
              className="text-slate mb-6 self-end"
            >
              <X size={20} />
            </button>
            {navContent}
          </div>
          <div
            className="flex-1 bg-black/60"
            onClick={() => setMobileOpen(false)}
          />
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 h-screen bg-panel border-r border-white/5 flex-col p-4">
        {navContent}
      </aside>
    </>
  );
}