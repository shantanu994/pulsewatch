import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import { useAuth } from "../lib/auth";
import AuthField from "../components/auth/AuthField";
import AuthLayout from "../components/auth/AuthLayout";

function readableAuthError(error) {
  const message = error?.message || "";
  return message === "Request failed"
    ? "Unable to sign in. Please check your email and password."
    : message;
}

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(readableAuthError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Sign in to PulseWatch"
      description="Keep a clear view of every endpoint that matters."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthField
          label="Email"
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
        />
        <AuthField
          label="Password"
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          autoComplete="current-password"
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword((visible) => !visible)}
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
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <div className="flex items-center gap-3 pt-2 text-sm text-slate">
          <span>Don&apos;t have an account?</span>
          <Link
            to="/signup"
            className="font-medium text-signal transition hover:text-offwhite"
          >
            Create account
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
