import { LoaderCircle, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/auth";
import AuthField from "../auth/AuthField";

function readableAuthError(error) {
  return error?.message === "Request failed"
    ? "Unable to sign in. Please check your email and password."
    : error?.message || "Unable to sign in. Please try again.";
}

export default function DemoLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const hasDemoAccount = Boolean(import.meta.env.VITE_DEMO_EMAIL && import.meta.env.VITE_DEMO_PASSWORD);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("Enter your email and password to continue.");
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (authError) {
      setError(readableAuthError(authError));
    } finally {
      setLoading(false);
    }
  }

  function fillDemoCredentials() {
    setEmail(import.meta.env.VITE_DEMO_EMAIL);
    setPassword(import.meta.env.VITE_DEMO_PASSWORD);
    setError("");
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-panel p-6 shadow-2xl shadow-black/20 sm:p-7">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-signal/20 bg-signal/10 text-signal"><ShieldCheck size={19} /></span>
        <div><h3 className="font-display text-xl text-offwhite">Welcome Back</h3><p className="text-sm text-slate">Sign in to your account</p></div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthField label="Email" id="demo-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" />
        <AuthField label="Password" id="demo-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" autoComplete="current-password" showPassword={showPassword} onTogglePassword={() => setShowPassword((visible) => !visible)} />
        {error ? <p role="alert" className="rounded-lg border border-alert/20 bg-alert/5 px-3 py-2.5 text-sm text-alert">{error}</p> : null}
        <button type="submit" disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-signal py-2.5 text-sm font-medium text-ink transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal">
          {loading ? <LoaderCircle size={16} className="animate-spin" /> : null}{loading ? "Signing in..." : "Sign In"}
        </button>
        {hasDemoAccount ? <button type="button" onClick={fillDemoCredentials} className="w-full rounded-lg border border-signal/25 py-2.5 text-sm font-medium text-signal transition hover:bg-signal/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal">Try Demo Account</button> : null}
        <p className="pt-1 text-center text-sm text-slate">Need an account? <a href="/signup" className="font-medium text-signal hover:text-offwhite">Create Account</a></p>
      </form>
    </div>
  );
}
