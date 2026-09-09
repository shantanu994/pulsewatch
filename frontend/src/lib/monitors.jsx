import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { api } from "./api";
import { latestCheck } from "./utils";
import { useAuth } from "./auth";

const POLL_MS = 45000;
const MonitorsContext = createContext(null);

async function loadExtras(monitors) {
  const results = await Promise.all(
    monitors.map(async (m) => {
      try {
        const [uptime, history] = await Promise.all([
          api.getMonitorUptime(m.id, 24),
          api.getMonitorHistory(m.id),
        ]);
        return {
          id: m.id,
          uptime,
          history,
          lastCheck: latestCheck(history),
        };
      } catch {
        return { id: m.id, uptime: null, history: [], lastCheck: null };
      }
    })
  );
  return Object.fromEntries(results.map((item) => [item.id, item]));
}

export function MonitorsProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [monitors, setMonitors] = useState([]);
  const [extras, setExtras] = useState({});
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState("");
  const [lastSynced, setLastSynced] = useState(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const refresh = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    else setSyncing(true);
    setError("");
    try {
      const data = await api.getMonitors();
      if (!mounted.current) return;
      setMonitors(data);
      const nextExtras = await loadExtras(data);
      if (!mounted.current) return;
      setExtras(nextExtras);
      setLastSynced(new Date());
    } catch (err) {
      if (!mounted.current) return;
      setError(err.message || "Unable to load monitors");
    } finally {
      if (mounted.current) {
        setLoading(false);
        setSyncing(false);
      }
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setMonitors([]);
      setExtras({});
      setLoading(false);
      return;
    }
    refresh();
    const id = setInterval(() => refresh({ silent: true }), POLL_MS);
    return () => clearInterval(id);
  }, [isAuthenticated, refresh]);

  const createMonitor = useCallback(async (url, intervalSeconds) => {
    const created = await api.createMonitor(url, intervalSeconds);
    await refresh({ silent: true });
    return created;
  }, [refresh]);

  const updateMonitor = useCallback(async (id, updates) => {
    const updated = await api.updateMonitor(id, updates);
    setMonitors((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
    return updated;
  }, []);

  const deleteMonitor = useCallback(async (id) => {
    await api.deleteMonitor(id);
    setMonitors((prev) => prev.filter((m) => m.id !== id));
    setExtras((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      monitors,
      extras,
      loading,
      syncing,
      error,
      lastSynced,
      refresh,
      createMonitor,
      updateMonitor,
      deleteMonitor,
    }),
    [monitors, extras, loading, syncing, error, lastSynced, refresh, createMonitor, updateMonitor, deleteMonitor]
  );

  return <MonitorsContext.Provider value={value}>{children}</MonitorsContext.Provider>;
}

export function useMonitors() {
  const ctx = useContext(MonitorsContext);
  if (!ctx) throw new Error("useMonitors must be used within MonitorsProvider");
  return ctx;
}
