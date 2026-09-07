import { useState } from "react";
import { api } from "../lib/api";
import { useToast } from "../lib/toast";

export default function AddMonitorForm({ onCreated }) {
  const { showToast } = useToast();
  const [url, setUrl] = useState("");
  const [interval, setInterval] = useState(300);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.createMonitor(url, Number(interval));
      setUrl("");
      setInterval(300);
      setOpen(false);
      onCreated();
      showToast("Monitor created successfully");
    } catch (err) {
      setError(err.message);
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Add new monitor"
        className="bg-signal text-ink font-medium rounded-lg px-4 py-2 hover:opacity-90 transition mb-6"
      >
        + Add Monitor
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center px-4 z-50">
          <form
            onSubmit={handleSubmit}
            className="bg-panel border border-white/10 rounded-xl p-6 max-w-sm w-full"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-offwhite font-medium">New Monitor</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="text-slate hover:text-offwhite text-sm"
              >
                Cancel
              </button>
            </div>

            <label htmlFor="monitor-url" className="block text-sm text-slate mb-1">
              URL
            </label>
            <input
              id="monitor-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              required
              className="w-full mb-4 bg-ink border border-white/10 rounded-lg px-3 py-2 text-offwhite outline-none focus:border-signal transition"
            />

            <label htmlFor="monitor-interval" className="block text-sm text-slate mb-1">
              Check interval (seconds)
            </label>
            <input
              id="monitor-interval"
              type="number"
              value={interval}
              onChange={(e) => setInterval(e.target.value)}
              min="60"
              required
              className="w-full mb-4 bg-ink border border-white/10 rounded-lg px-3 py-2 text-offwhite outline-none focus:border-signal transition"
            />

            {error && <p className="text-alert text-sm mb-3">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-signal text-ink font-medium rounded-lg py-2 hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Monitor"}
            </button>
          </form>
        </div>
      )}
    </>
  );
}