import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check, LoaderCircle } from "lucide-react";
import { useAuth } from "../lib/auth";
import AuthField from "../components/auth/AuthField";
import AuthLayout from "../components/auth/AuthLayout";

function readableAuthError(error) {
  const message = error?.message || "";
  return message === "Request failed"
    ? "Unable to create account. Please try again."
    : message;
}

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordChecks = useMemo(
    () => [
      { label: "8+ characters", valid: password.length >= 8 },
      { label: "One number", valid: /\d/.test(password) },
    ],
    [password],
  );

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    setLoading(true);
    try {
      await signup(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(readableAuthError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      eyebrow="Start monitoring"
      title="Create your PulseWatch account"
      description="Start watching your services in minutes."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthField
          label="Email"
          id="signup-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
        />
        <AuthField
          label="Password"
          id="signup-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Create a password"
          minLength={8}
          autoComplete="new-password"
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword((visible) => !visible)}
        />
        <div className="-mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] text-slate">
          {passwordChecks.map((check) => (
            <span
              key={check.label}
              className={check.valid ? "text-signal" : ""}
            >
              {check.valid ? <Check size={11} className="mr-1 inline" /> : ""}
              {check.label}
            </span>
          ))}
        </div>
        <AuthField
          label="Confirm password"
          id="signup-confirm"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm your password"
          autoComplete="new-password"
          showPassword={showConfirmPassword}
          onTogglePassword={() => setShowConfirmPassword((visible) => !visible)}
        />

        {error ? (
          <p
            role="alert"
            className="rounded-lg border border-alert/20 bg-alert/5 px-3 py-2.5 text-sm text-alert"
          >
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-signal py-2.5 text-sm font-medium text-ink transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
        >
          {loading ? <LoaderCircle size={16} className="animate-spin" /> : null}
          {loading ? "Creating account..." : "Create account"}
        </button>

        <div className="flex items-center gap-3 pt-2 text-sm text-slate">
          <span>Already have an account?</span>
          <Link
            to="/login"
            className="font-medium text-signal transition hover:text-offwhite"
          >
            Sign in
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
