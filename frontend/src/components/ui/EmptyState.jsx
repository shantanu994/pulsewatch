import Button from "./Button";

export default function EmptyState({ title, body, actionLabel, onAction, icon: Icon }) {
  return (
    <div className="bg-panel border border-white/5 rounded-xl px-6 py-14 text-center">
      {Icon ? (
        <div className="mx-auto mb-4 w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate">
          <Icon size={18} />
        </div>
      ) : null}
      <p className="font-display text-offwhite tracking-wide mb-1">{title}</p>
      <p className="text-slate text-sm max-w-sm mx-auto">{body}</p>
      {actionLabel && onAction ? (
        <div className="mt-5">
          <Button onClick={onAction}>{actionLabel}</Button>
        </div>
      ) : null}
    </div>
  );
}
