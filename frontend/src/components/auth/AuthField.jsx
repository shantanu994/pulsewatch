import { Eye, EyeOff } from "lucide-react";

export default function AuthField({ label, id, type = "text", value, onChange, placeholder, autoComplete, required = true, minLength, showPassword, onTogglePassword }) {
  const isPassword = type === "password" || type === "text-password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-xs font-medium text-slate">{label}</label>
      <span className="relative block">
        <input
          id={id}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          minLength={minLength}
          autoComplete={autoComplete}
          className={`w-full rounded-lg border border-white/10 bg-ink px-3 py-2.5 text-sm text-offwhite outline-none transition placeholder:text-slate/60 focus:border-signal/60 focus:ring-2 focus:ring-signal/10 ${isPassword ? "pr-11" : ""}`}
        />
        {isPassword ? (
          <button
            type="button"
            onClick={onTogglePassword}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate transition hover:text-offwhite focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        ) : null}
      </span>
    </div>
  );
}
