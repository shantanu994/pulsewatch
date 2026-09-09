import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { INTERVAL_OPTIONS } from "../../lib/utils";
import { useMonitors } from "../../lib/monitors";
import { useToast } from "../../lib/toast";
import { useUi } from "../../lib/ui";

export default function AddMonitorModal() {
  const { addMonitorOpen, setAddMonitorOpen } = useUi();
  const { createMonitor } = useMonitors();
  const { showToast } = useToast();
  const [url, setUrl] = useState("");
  const [interval, setInterval] = useState(300);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!addMonitorOpen) {
      setUrl("");
      setInterval(300);
      setError("");
      setLoading(false);
    }
  }, [addMonitorOpen]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!url.trim()) {
      setError("Enter a monitor URL.");
      return;
    }
    setLoading(true);
    try {
      await createMonitor(url.trim(), Number(interval));
      showToast("Monitor created successfully");
      setAddMonitorOpen(false);
    } catch (err) {
      setError(err.message);
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      open={addMonitorOpen}
      onClose={() => setAddMonitorOpen(false)}
      title="Add new monitor"
    >
      <form onSubmit={handleSubmit}>
        <label htmlFor="monitor-url" className="block text-sm text-slate mb-1">
          Monitor URL
        </label>
        <input
          id="monitor-url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          required
          autoFocus
          className="w-full mb-5 bg-ink border border-white/10 rounded-lg px-3 py-2 text-offwhite outline-none focus:border-signal transition"
        />

        <p className="text-sm text-slate mb-2">Check frequency</p>
        <div className="grid grid-cols-2 gap-2 mb-5">
          {INTERVAL_OPTIONS.map((opt) => (
            <button
              key={opt.seconds}
              type="button"
              onClick={() => setInterval(opt.seconds)}
              className={`rounded-lg border px-3 py-2 text-sm font-mono transition ${
                interval === opt.seconds
                  ? "border-signal/40 bg-signal/10 text-signal"
                  : "border-white/10 text-slate hover:text-offwhite"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {error ? <p className="text-alert text-sm mb-4">{error}</p> : null}

        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setAddMonitorOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Monitor"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
