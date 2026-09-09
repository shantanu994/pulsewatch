import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  LayoutDashboard,
  Plus,
  RefreshCw,
  Settings,
  Waypoints,
} from "lucide-react";
import { useUi } from "../../lib/ui";
import { useMonitors } from "../../lib/monitors";

export default function CommandPalette() {
  const { paletteOpen, setPaletteOpen, setAddMonitorOpen } = useUi();
  const { refresh } = useMonitors();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);

  const commands = useMemo(
    () => [
      { id: "add", label: "Add Monitor", icon: Plus, run: () => setAddMonitorOpen(true) },
      { id: "dash", label: "Go to Dashboard", icon: LayoutDashboard, run: () => navigate("/dashboard") },
      { id: "mon", label: "Go to Monitors", icon: Waypoints, run: () => navigate("/monitors") },
      { id: "an", label: "Go to Analytics", icon: BarChart3, run: () => navigate("/analytics") },
      { id: "set", label: "Settings", icon: Settings, run: () => navigate("/settings") },
      { id: "ref", label: "Refresh Data", icon: RefreshCw, run: () => refresh({ silent: true }) },
    ],
    [navigate, refresh, setAddMonitorOpen]
  );

  const filtered = commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    setIndex(0);
  }, [query, paletteOpen]);

  useEffect(() => {
    if (!paletteOpen) setQuery("");
  }, [paletteOpen]);

  function run(cmd) {
    setPaletteOpen(false);
    cmd.run();
  }

  function onKeyDown(e) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex((i) => Math.min(filtered.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter" && filtered[index]) {
      e.preventDefault();
      run(filtered[index]);
    } else if (e.key === "Escape") {
      setPaletteOpen(false);
    }
  }

  return (
    <AnimatePresence>
      {paletteOpen ? (
        <motion.div className="fixed inset-0 z-[75] flex items-start justify-center pt-[15vh] px-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/65"
            aria-label="Close command palette"
            onClick={() => setPaletteOpen(false)}
          />
          <motion.div
            role="dialog"
            aria-label="Command palette"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="relative w-full max-w-lg bg-panel border border-white/10 rounded-xl overflow-hidden"
          >
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Search commands..."
              className="w-full bg-transparent px-4 py-3 text-sm text-offwhite outline-none border-b border-white/5"
            />
            <ul className="max-h-72 overflow-y-auto py-1">
              {filtered.length === 0 ? (
                <li className="px-4 py-3 text-sm text-slate">No matching commands</li>
              ) : (
                filtered.map((cmd, i) => (
                  <li key={cmd.id}>
                    <button
                      type="button"
                      onMouseEnter={() => setIndex(i)}
                      onClick={() => run(cmd)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left ${
                        i === index ? "bg-white/5 text-offwhite" : "text-slate"
                      }`}
                    >
                      <cmd.icon size={15} />
                      {cmd.label}
                    </button>
                  </li>
                ))
              )}
            </ul>
            <p className="px-4 py-2 text-[10px] text-slate border-t border-white/5">
              ↑↓ to navigate · Enter to run · Esc to close
            </p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
