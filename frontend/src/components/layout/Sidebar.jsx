import { NavLink, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  BarChart3,
  LayoutDashboard,
  LogOut,
  Settings,
  Waypoints,
} from "lucide-react";
import { useAuth } from "../../lib/auth";
import { useUi } from "../../lib/ui";

const links = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/monitors", label: "Monitors", icon: Waypoints },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { sidebarOpen, setSidebarOpen } = useUi();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition outline-none focus-visible:ring-2 focus-visible:ring-signal ${
      isActive ? "bg-signal/10 text-signal" : "text-slate hover:text-offwhite hover:bg-white/5"
    }`;

  const content = (
    <>
      <div className="px-3 mb-8">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-md bg-signal/15 border border-signal/20 flex items-center justify-center">
            <Activity size={13} className="text-signal" />
          </span>
          <span className="font-display text-lg tracking-wide text-offwhite">PULSEWATCH</span>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} className={linkClass} onClick={() => setSidebarOpen(false)}>
            <link.icon size={16} />
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="space-y-1 border-t border-white/5 pt-3">
        <NavLink to="/settings" className={linkClass} onClick={() => setSidebarOpen(false)}>
          <Settings size={16} />
          Settings
        </NavLink>
        <div className="px-3 py-2">
          <p className="text-[10px] uppercase tracking-wider text-slate">User</p>
          <p className="text-sm text-offwhite truncate">{user?.email || "Signed in"}</p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate hover:text-alert hover:bg-white/5 transition outline-none focus-visible:ring-2 focus-visible:ring-signal"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      <aside className="hidden md:flex w-60 shrink-0 h-screen sticky top-0 bg-panel/90 border-r border-white/5 flex-col p-4">
        {content}
      </aside>

      <AnimatePresence>
        {sidebarOpen ? (
          <motion.div
            className="md:hidden fixed inset-0 z-50 flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              className="absolute inset-0 bg-black/60"
              aria-label="Close navigation"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.2 }}
              className="relative w-72 max-w-[85vw] h-full bg-panel border-r border-white/5 flex flex-col p-4"
            >
              {content}
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
