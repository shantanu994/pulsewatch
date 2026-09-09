export default function Card({ children, className = "", as: Tag = "div", ...props }) {
  return (
    <Tag
      className={`bg-panel border border-white/5 rounded-xl ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}
