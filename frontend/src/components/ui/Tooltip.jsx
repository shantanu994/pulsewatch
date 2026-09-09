export default function Tooltip({ label, children }) {
  return (
    <span className="relative inline-flex group">
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block group-focus-within:block z-20 whitespace-nowrap rounded-md border border-white/10 bg-ink px-2 py-1 text-[11px] font-mono text-offwhite"
      >
        {label}
      </span>
    </span>
  );
}
