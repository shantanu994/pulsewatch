import { Search } from "lucide-react";
import { useUi } from "../../lib/ui";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "operational", label: "Up" },
  { key: "down", label: "Down" },
  { key: "paused", label: "Paused" },
];

export default function MonitorToolbar({
  filter,
  onFilter,
  sort,
  onSort,
  showSort = false,
}) {
  const { searchQuery, setSearchQuery } = useUi();

  return (
    <div className="flex flex-col gap-3 mb-5">
      <label className="flex lg:hidden items-center gap-2 bg-panel border border-white/10 rounded-lg px-3 py-2">
        <Search size={14} className="text-slate" />
        <input
          id="search-mobile"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search monitors..."
          className="bg-transparent text-sm text-offwhite outline-none w-full"
        />
      </label>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => onFilter(f.key)}
              className={`text-xs font-mono px-3 py-1.5 rounded-full whitespace-nowrap border transition outline-none focus-visible:ring-2 focus-visible:ring-signal ${
                filter === f.key
                  ? "bg-signal/10 text-signal border-signal/20"
                  : "text-slate border-white/10 hover:text-offwhite"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        {showSort ? (
          <label className="text-xs text-slate flex items-center gap-2">
            Sort
            <select
              value={sort}
              onChange={(e) => onSort(e.target.value)}
              className="bg-panel border border-white/10 rounded-lg px-2 py-1.5 text-offwhite outline-none"
            >
              <option value="name">Name</option>
              <option value="uptime">Uptime</option>
              <option value="status">Status</option>
              <option value="recent">Recently checked</option>
            </select>
          </label>
        ) : null}
      </div>
    </div>
  );
}
