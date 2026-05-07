import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Notice from "../components/Notice";
import { getErrorMessage, registerUser } from "../lib/api";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    Password: "",
    confirmPassword: "",
    role: "student",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (formData.Password !== formData.confirmPassword) {
      setError("Password and confirm password must match.");
      return;
    }

    setLoading(true);

    try {
      const response = await registerUser(formData);
      setSuccess(response.message || "Registration successful.");
      setTimeout(() => navigate("/login"), 800);
    } catch (err) {
      setError(getErrorMessage(err, "Registration failed."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen bg-[linear-gradient(180deg,_#fbf5ec,_#f3eadf)] lg:grid-cols-[0.98fr_1.02fr]">
      <section className="flex items-center justify-center px-4 py-10">
        <form
          onSubmit={handleSubmit}
          className="page-glow relative w-full max-w-xl overflow-hidden rounded-[2rem] border border-[var(--line)] bg-[var(--paper)] p-8 shadow-[var(--shadow)]"
        >
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--brand-deep)]">
              Create account
            </p>
            <h1 className="font-display mt-3 text-5xl font-bold text-[var(--ink)]">
              Start learning with taste
            </h1>

            <div className="mt-6 space-y-4">
              <Notice type="error" message={error} />
              <Notice type="success" message={success} />

              <div className="grid gap-4 md:grid-cols-2">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={(event) =>
                    setFormData((current) => ({ ...current, username: event.target.value }))
                  }
                  className="rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-4 outline-none transition focus:border-[var(--brand)]"
                  required
                />
                <select
                  name="role"
                  value={formData.role}
                  onChange={(event) =>
                    setFormData((current) => ({ ...current, role: event.target.value }))
                  }
                  className="rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-4 outline-none transition focus:border-[var(--brand)]"
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, email: event.target.value }))
                }
                className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-4 outline-none transition focus:border-[var(--brand)]"
                required
              />
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  type="password"
                  name="Password"
                  placeholder="Password"
                  value={formData.Password}
                  onChange={(event) =>
                    setFormData((current) => ({ ...current, Password: event.target.value }))
                  }
                  className="rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-4 outline-none transition focus:border-[var(--brand)]"
                  required
                />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      confirmPassword: event.target.value,
                    }))
                  }
                  className="rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-4 outline-none transition focus:border-[var(--brand)]"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-[var(--ink)] px-4 py-4 font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[var(--brand-deep)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </div>

            <p className="mt-6 text-sm text-[var(--muted)]">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-[var(--accent)] hover:underline">
                Login
              </Link>
            </p>
          </div>
        </form>
      </section>

      <section className="hidden px-10 py-14 lg:flex lg:flex-col lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--brand-deep)]">
            Teach or learn
          </p>
          <h2 className="font-display mt-6 max-w-xl text-7xl font-bold leading-[0.98] text-[var(--ink)]">
            Join a course platform that feels cared for.
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-8 text-[var(--muted)]">
            Create a student or teacher account, build a course catalog with clearer
            structure, and move from signup to publishing without a clunky experience.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[1.7rem] border border-[var(--line)] bg-[var(--paper)] p-5 shadow-[0_18px_36px_rgba(51,34,23,0.08)]">
            <p className="font-display text-3xl font-bold text-[var(--ink)]">Students</p>
            <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
              Enroll in published courses and track your learning path.
            </p>
          </div>
          <div className="rounded-[1.7rem] border border-[var(--line)] bg-[var(--accent-soft)] p-5 shadow-[0_18px_36px_rgba(51,34,23,0.08)]">
            <p className="font-display text-3xl font-bold text-[var(--ink)]">Teachers</p>
            <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
              Create, upload, and publish creator-led learning experiences.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
