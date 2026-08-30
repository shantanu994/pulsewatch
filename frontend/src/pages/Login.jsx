import { useState } from "react";
import { api } from "../lib/api";

export default function Login({ onLogin, onSwitchToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await api.login(email, password);
      localStorage.setItem("token", data.access_token);
      onLogin();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-panel rounded-2xl p-8 border border-white/5"
      >
        <h1 className="font-display text-2xl text-offwhite mb-1">
          Welcome back
        </h1>
        <p className="text-slate text-sm mb-6">
          Log in to your PulseWatch account
        </p>

        <label className="block text-sm text-slate mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full mb-4 bg-ink border border-white/10 rounded-lg px-3 py-2 text-offwhite outline-none focus:border-signal transition"
        />

        <label className="block text-sm text-slate mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full mb-6 bg-ink border border-white/10 rounded-lg px-3 py-2 text-offwhite outline-none focus:border-signal transition"
        />

        {error && <p className="text-alert text-sm mb-4">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-signal text-ink font-medium rounded-lg py-2 hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>
        <p className="text-slate text-sm text-center mt-4">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="text-signal hover:underline"
          >
            Sign up
          </button>
        </p>
      </form>
    </div>
  );
}
