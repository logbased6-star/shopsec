import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const user = await login(email, password);
      navigate(user.role === "ADMIN" ? "/admin" : location.state?.from || "/");
    } catch (err) {
      setError(err.response?.data?.error || "Could not log in.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <h1 className="font-display text-3xl text-ink">Welcome back</h1>
      <p className="text-slate mt-2 text-sm">Log in to your ShopSec account.</p>
      <div className="trace-divider my-6" />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-ink/15 focus-ring outline-none"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink mb-1">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-ink/15 focus-ring outline-none"
          />
        </div>

        {error && <p className="text-sm text-coral">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-ink text-paper py-3 rounded-full font-medium hover:bg-indigo transition-colors disabled:opacity-50"
        >
          {submitting ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p className="text-sm text-slate mt-6">
        New here?{" "}
        <Link to="/register" className="text-indigo font-medium hover:underline">
          Create an account
        </Link>
      </p>

      <div className="mt-8 text-xs text-slate bg-sand/60 border border-ink/10 rounded-lg p-3 font-mono">
        Demo login: demo@shopsec.dev / Demo@12345
        <br />
        Admin login: admin@shopsec.dev / Admin@12345
      </div>
    </div>
  );
}
