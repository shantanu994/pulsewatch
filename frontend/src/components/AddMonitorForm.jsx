import { useState } from "react";
import { api } from "../lib/api";
import { useToast } from "../lib/toast";

export default function AddMonitorForm({ onCreated }) {
  const [url, setUrl] = useState("");
  const [interval, setInterval] = useState(300);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { showToast } = useToast();

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

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="bg-signal text-ink font-medium rounded-lg px-4 py-2 hover:opacity-90 transition"
      >
        + Add Monitor
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-panel border border-white/5 rounded-xl p-5 mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-offwhite font-medium">New Monitor</h2>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-slate hover:text-offwhite text-sm"
        >
          Cancel
        </button>
      </div>

      <label className="block text-sm text-slate mb-1">URL</label>
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://example.com"
        required
        className="w-full mb-4 bg-ink border border-white/10 rounded-lg px-3 py-2 text-offwhite outline-none focus:border-signal transition"
      />

      <label className="block text-sm text-slate mb-1">
        Check interval (seconds)
      </label>
      <input
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
  );
}
