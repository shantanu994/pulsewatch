import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Activity } from "lucide-react";
import { useAuth } from "../lib/auth";

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
        <h1 className="font-display text-2xl text-offwhite mb-1">Create account</h1>
        <p className="text-slate text-sm mb-6">Start watching endpoints in minutes.</p>

        <label htmlFor="signup-email" className="block text-sm text-slate mb-1">
          Email
        </label>
        <input
          id="signup-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="w-full mb-4 bg-ink border border-white/10 rounded-lg px-3 py-2 text-offwhite outline-none focus:border-signal transition"
        />

        <label htmlFor="signup-password" className="block text-sm text-slate mb-1">
          Password
        </label>
        <input
          id="signup-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          autoComplete="new-password"
          className="w-full mb-4 bg-ink border border-white/10 rounded-lg px-3 py-2 text-offwhite outline-none focus:border-signal transition"
        />

        <label htmlFor="signup-confirm" className="block text-sm text-slate mb-1">
          Confirm password
        </label>
        <input
          id="signup-confirm"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full mb-6 bg-ink border border-white/10 rounded-lg px-3 py-2 text-offwhite outline-none focus:border-signal transition"
        />

        {error ? <p className="text-alert text-sm mb-4">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-signal text-ink font-medium rounded-lg py-2 hover:opacity-90 transition disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-signal"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>

        <p className="text-slate text-sm text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-signal hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
