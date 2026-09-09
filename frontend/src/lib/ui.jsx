import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

const UiContext = createContext(null);

export function UiProvider({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [addMonitorOpen, setAddMonitorOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef(null);

  const focusSearch = useCallback(() => {
    const desktop = document.getElementById("search-desktop");
    const mobile = document.getElementById("search-mobile");
    if (window.matchMedia("(min-width: 1024px)").matches) {
      desktop?.focus();
    } else {
      (mobile || desktop)?.focus();
    }
  }, []);

  const value = useMemo(
    () => ({
      sidebarOpen,
      setSidebarOpen,
      paletteOpen,
      setPaletteOpen,
      addMonitorOpen,
      setAddMonitorOpen,
      searchQuery,
      setSearchQuery,
      searchRef,
      focusSearch,
    }),
    [sidebarOpen, paletteOpen, addMonitorOpen, searchQuery, focusSearch]
  );

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
}

export function useUi() {
  const ctx = useContext(UiContext);
  if (!ctx) throw new Error("useUi must be used within UiProvider");
  return ctx;
}
