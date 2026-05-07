import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Notice from "../components/Notice";
import { fetchProfile, getErrorMessage, loginUser } from "../lib/api";
import { setSession } from "../lib/auth";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await loginUser(formData);
      setSession({
        accessToken: response.token?.accessToken,
        refreshToken: response.token?.refreshToken,
      });

      const profileResponse = await fetchProfile();
      setSession({ user: profileResponse.data });
      navigate("/dashboard");
    } catch (err) {
      setError(getErrorMessage(err, "Invalid email or password."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen bg-[linear-gradient(180deg,_#fbf5ec,_#f3eadf)] lg:grid-cols-[1.02fr_0.98fr]">
      <section className="hidden px-10 py-14 lg:flex lg:flex-col lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--brand-deep)]">
            LearnSphere
          </p>
          <h1 className="font-display mt-6 max-w-xl text-7xl font-bold leading-[0.98] text-[var(--ink)]">
            Come back to the courses worth finishing.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-[var(--muted)]">
            Sign in to manage your learning, publish creator-led classes, and keep your
            account in sync across the course workspace.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[1.7rem] border border-[var(--line)] bg-[var(--paper)] p-5 shadow-[0_18px_36px_rgba(51,34,23,0.08)]">
            <p className="font-display text-4xl font-bold text-[var(--ink)]">10K+</p>
            <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
              Learners building practical skills and project confidence.
            </p>
          </div>
          <div className="rounded-[1.7rem] border border-[var(--line)] bg-[var(--ink)] p-5 text-white shadow-[0_18px_36px_rgba(51,34,23,0.14)]">
            <p className="font-display text-4xl font-bold">Creator-led</p>
            <p className="mt-2 text-sm leading-7 text-white/74">
              Publish, enroll, and manage course actions from one workflow.
            </p>
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center px-4 py-10">
        <form
          onSubmit={handleSubmit}
          className="page-glow relative w-full max-w-md overflow-hidden rounded-[2rem] border border-[var(--line)] bg-[var(--paper)] p-8 shadow-[var(--shadow)]"
        >
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--brand-deep)]">
              Welcome back
            </p>
            <h1 className="font-display mt-3 text-5xl font-bold text-[var(--ink)]">
              Login to continue
            </h1>

            <div className="mt-6 space-y-4">
              <Notice type="error" message={error} />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, email: event.target.value }))
                }
                className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-4 outline-none transition focus:border-[var(--brand)]"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, password: event.target.value }))
                }
                className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-4 outline-none transition focus:border-[var(--brand)]"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-[var(--brand)] px-4 py-4 font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[var(--brand-deep)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Login"}
              </button>
            </div>

            <div className="mt-6 flex flex-col gap-3 text-sm">
              <Link to="/forgot-password" className="font-semibold text-[var(--accent)] hover:underline">
                Forgot password?
              </Link>
              <p className="text-[var(--muted)]">
                Do not have an account?{" "}
                <Link to="/register" className="font-semibold text-[var(--accent)] hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}
