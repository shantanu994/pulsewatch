export default function HealthChart({ operational, down, paused, uptime }) {
  const total = Math.max(operational + down + paused, 1);
  const radius = 54;
  const circ = 2 * Math.PI * radius;
  const op = (operational / total) * circ;
  const dn = (down / total) * circ;
  const ps = (paused / total) * circ;

  return (
    <div className="relative w-44 h-44 mx-auto">
      <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="#3DDC97"
          strokeWidth="10"
          strokeDasharray={`${op} ${circ - op}`}
          strokeLinecap="butt"
        />
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="#FF5C5C"
          strokeWidth="10"
          strokeDasharray={`${dn} ${circ - dn}`}
          strokeDashoffset={-op}
        />
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="#8B98A5"
          strokeWidth="10"
          strokeDasharray={`${ps} ${circ - ps}`}
          strokeDashoffset={-(op + dn)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="font-mono text-2xl text-offwhite">{uptime}</p>
        <p className="text-[10px] uppercase tracking-[0.16em] text-slate mt-1">Uptime</p>
      </div>
    </div>
  );
}
