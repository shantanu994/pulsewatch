import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Activity } from "lucide-react";
import { useAuth } from "../lib/auth";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen app-surface flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-panel rounded-xl p-8 border border-white/5"
      >
        <div className="flex items-center gap-2 mb-8">
          <span className="w-7 h-7 rounded-md bg-signal/15 border border-signal/20 flex items-center justify-center">
            <Activity size={14} className="text-signal" />
          </span>
          <span className="font-display tracking-wide text-offwhite">PULSEWATCH</span>
        </div>
        <h1 className="font-display text-2xl text-offwhite mb-1">Sign in</h1>
        <p className="text-slate text-sm mb-6">Infrastructure visibility, without the noise.</p>

        <label htmlFor="login-email" className="block text-sm text-slate mb-1">
          Email
        </label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="w-full mb-4 bg-ink border border-white/10 rounded-lg px-3 py-2 text-offwhite outline-none focus:border-signal transition"
        />

        <label htmlFor="login-password" className="block text-sm text-slate mb-1">
          Password
        </label>
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className="w-full mb-6 bg-ink border border-white/10 rounded-lg px-3 py-2 text-offwhite outline-none focus:border-signal transition"
        />

        {error ? <p className="text-alert text-sm mb-4">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-signal text-ink font-medium rounded-lg py-2 hover:opacity-90 transition disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-signal"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p className="text-slate text-sm text-center mt-4">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="text-signal hover:underline">
            Create one
          </Link>
        </p>
      </form>
    </div>
  );
}
