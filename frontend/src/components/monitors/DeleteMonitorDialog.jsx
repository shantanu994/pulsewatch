import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { monitorName } from "../../lib/utils";

export default function DeleteMonitorDialog({ monitor, open, onClose, onConfirm, loading }) {
  if (!monitor) return null;
  return (
    <Modal open={open} onClose={onClose} title={`Delete ${monitorName(monitor.url)}?`}>
      <p className="text-slate text-sm mb-4">This will permanently remove:</p>
      <ul className="text-sm text-offwhite space-y-1 mb-6 list-disc list-inside">
        <li>Monitor</li>
        <li>All check history</li>
      </ul>
      <p className="text-slate text-sm mb-6">This cannot be undone.</p>
      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm} disabled={loading}>
          {loading ? "Deleting..." : "Delete Monitor"}
        </Button>
      </div>
    </Modal>
  );
}
