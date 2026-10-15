import { Activity, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const links = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Benefits", href: "#benefits" },
  { label: "About", href: "#about" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-ink/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-signal/25 bg-signal/10 text-signal">
            <Activity size={16} />
          </span>
          <span className="font-display text-lg tracking-[0.12em] text-offwhite">
            PULSEWATCH
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Main navigation">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="text-sm text-slate transition hover:text-offwhite">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a href="#demo" className="rounded-lg bg-signal px-4 py-2.5 text-sm font-medium text-ink transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal">
            Live Demo
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          className="rounded-lg p-2 text-slate transition hover:text-offwhite focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal md:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open ? (
        <nav id="mobile-navigation" className="border-t border-white/[0.06] px-5 pb-5 pt-3 md:hidden" aria-label="Mobile navigation">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <a key={link.href} href={link.href} onClick={closeMenu} className="rounded-lg px-3 py-3 text-sm text-slate transition hover:bg-white/[0.04] hover:text-offwhite">
                {link.label}
              </a>
            ))}
            <a href="#demo" onClick={closeMenu} className="mt-2 rounded-lg bg-signal px-3 py-3 text-center text-sm font-medium text-ink">
              Live Demo
            </a>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
