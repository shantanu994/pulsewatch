import { TIME_RANGES } from "../../lib/utils";

export default function TimeRangeControl({ value, onChange, ranges = TIME_RANGES }) {
  return (
    <div className="flex gap-1 overflow-x-auto" role="tablist" aria-label="Time range">
      {ranges.map((range) => (
        <button
          key={range.key}
          type="button"
          role="tab"
          aria-selected={value === range.hours}
          onClick={() => onChange(range.hours)}
          className={`font-mono text-[11px] px-2.5 py-1 rounded-md border transition whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-signal ${
            value === range.hours
              ? "border-signal/30 bg-signal/10 text-signal"
              : "border-white/10 text-slate hover:text-offwhite"
          }`}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
}
