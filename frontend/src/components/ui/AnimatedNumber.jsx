import { useEffect, useRef, useState } from "react";

export default function AnimatedNumber({ value, decimals = 0, suffix = "" }) {
  const [display, setDisplay] = useState(value ?? 0);
  const frame = useRef(null);
  const previous = useRef(value ?? 0);

  useEffect(() => {
    if (value == null || Number.isNaN(Number(value))) {
      setDisplay(null);
      return undefined;
    }
    const from = Number(previous.current) || 0;
    const to = Number(value);
    previous.current = to;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setDisplay(to);
      return undefined;
    }
    const start = performance.now();
    const duration = 420;
    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) * (1 - t);
      setDisplay(from + (to - from) * eased);
      if (t < 1) frame.current = requestAnimationFrame(tick);
    }
    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [value]);

  if (display == null) return "—";
  return `${Number(display).toFixed(decimals)}${suffix}`;
}
