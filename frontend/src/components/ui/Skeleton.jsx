export default function Skeleton({ className = "" }) {
  return (
    <div
      className={`bg-white/5 rounded-lg animate-pulse ${className}`}
    />
  );
}