import { Menu, Plus, RefreshCw, Search } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useMonitors } from "../../lib/monitors";
import { useUi } from "../../lib/ui";
import { timeAgo } from "../../lib/utils";

const titles = {
  "/dashboard": ["Overview", "Monitor your infrastructure at a glance."],
  "/monitors": ["Monitors", "Every endpoint PulseWatch is watching."],
  "/analytics": ["Analytics", "Uptime and check activity from recorded data."],
  "/settings": ["Settings", "Account and monitoring configuration."],
};

export default function Header() {
  const location = useLocation();
  const { setSidebarOpen, setAddMonitorOpen, searchQuery, setSearchQuery, searchRef } = useUi();
  const { refresh, syncing, lastSynced } = useMonitors();
  const isMonitorDetail = location.pathname.startsWith("/monitors/");
  const [title, subtitle] = isMonitorDetail
    ? ["Monitor", "Uptime, timeline, and check history."]
    : titles[location.pathname] || ["PulseWatch", "Infrastructure visibility."];
  const showSearch = location.pathname === "/dashboard" || location.pathname === "/monitors";

  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-ink/85 backdrop-blur">
      <div className="flex items-center justify-between gap-4 px-4 md:px-8 py-4">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            className="md:hidden text-offwhite p-1.5 rounded-md hover:bg-white/5 outline-none focus-visible:ring-2 focus-visible:ring-signal"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation"
          >
            <Menu size={20} />
          </button>
          <div className="min-w-0">
            <h1 className="font-display text-xl text-offwhite truncate">{title}</h1>
            <p className="text-slate text-xs hidden sm:block">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-full border border-white/8">
            <span className={`w-1.5 h-1.5 rounded-full ${syncing ? "bg-slate" : "bg-signal status-pulse"}`} />
            <div>
              <p className="text-[10px] font-mono text-offwhite leading-none">{syncing ? "SYNCING" : "SYNC"}</p>
              <p className="text-[10px] text-slate">
                {syncing ? "Refreshing…" : lastSynced ? `Updated ${timeAgo(lastSynced.toISOString())}` : "Waiting"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => refresh({ silent: true })}
            className="p-2 rounded-lg text-slate hover:text-offwhite hover:bg-white/5 outline-none focus-visible:ring-2 focus-visible:ring-signal"
            aria-label="Refresh data"
          >
            <RefreshCw size={16} className={syncing ? "animate-spin" : ""} />
          </button>

          {showSearch ? (
            <label className="hidden lg:flex items-center gap-2 bg-panel border border-white/10 rounded-lg px-3 py-2 min-w-56">
              <Search size={14} className="text-slate" />
              <input
                id="search-desktop"
                ref={searchRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search monitors..."
                className="bg-transparent text-sm text-offwhite outline-none w-full"
              />
            </label>
          ) : null}

          <button
            type="button"
            onClick={() => setAddMonitorOpen(true)}
            className="inline-flex items-center gap-1.5 bg-signal text-ink text-sm font-medium rounded-lg px-3 py-2 hover:opacity-90 outline-none focus-visible:ring-2 focus-visible:ring-signal"
          >
            <Plus size={14} />
            <span className="hidden sm:inline">Add Monitor</span>
          </button>
        </div>
      </div>
    </header>
  );
}
