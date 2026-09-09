import Button from "./Button";

export default function ErrorState({
  title = "Something went wrong.",
  body = "Unable to load your monitors.",
  onRetry,
  retryLabel = "Try Again",
}) {
  return (
    <div className="bg-panel border border-alert/20 rounded-xl px-6 py-12 text-center">
      <p className="text-offwhite font-medium mb-1">{title}</p>
      <p className="text-slate text-sm mb-5">{body}</p>
      {onRetry ? (
        <Button onClick={onRetry} variant="secondary">
          {retryLabel}
        </Button>
      ) : null}
    </div>
  );
}
