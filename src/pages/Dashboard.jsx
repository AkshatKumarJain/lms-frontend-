import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import Notice from "../components/Notice";
import PageCard from "../components/PageCard";
import {
  fetchCourses,
  fetchProfile,
  getErrorMessage,
  logoutUser,
  refreshAuthToken,
} from "../lib/api";
import { clearSession, getStoredUser, setSession } from "../lib/auth";

function StatCard({ label, value, tone = "default" }) {
  const toneClass =
    tone === "accent"
      ? "bg-[var(--accent-soft)]"
      : tone === "brand"
        ? "bg-[rgba(201,101,59,0.1)]"
        : "bg-white/70";

  return (
    <div className={`rounded-[1.5rem] border border-[var(--line)] p-5 ${toneClass}`}>
      <p className="text-sm text-[var(--muted)]">{label}</p>
      <p className="mt-3 font-display text-4xl font-bold text-[var(--ink)]">{value}</p>
    </div>
  );
}

function QuickLink({ to, eyebrow, title, description }) {
  return (
    <Link
      to={to}
      className="rounded-[1.6rem] border border-[var(--line)] bg-[var(--paper)] p-5 shadow-[0_18px_36px_rgba(51,34,23,0.06)] transition hover:-translate-y-1 hover:shadow-[0_24px_46px_rgba(51,34,23,0.11)]"
    >
      <p className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--brand-deep)]">
        {eyebrow}
      </p>
      <h2 className="mt-3 font-display text-3xl font-bold text-[var(--ink)]">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{description}</p>
    </Link>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getStoredUser());
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [profileResponse, coursesResponse] = await Promise.all([
          fetchProfile(),
          fetchCourses(),
        ]);
        setUser(profileResponse.data);
        setCourses(coursesResponse.data || []);
      } catch (err) {
        setError(getErrorMessage(err, "Could not load dashboard."));
      }
    };

    loadDashboard();
  }, []);

  const handleLogout = async () => {
    setError("");
    setMessage("");

    try {
      if (user?._id) {
        await logoutUser(user._id);
      }
      clearSession();
      navigate("/login");
    } catch (err) {
      setError(getErrorMessage(err, "Could not log out."));
    }
  };

  const handleRefresh = async () => {
    setError("");
    setMessage("");

    try {
      const response = await refreshAuthToken();
      const tokenValue =
        response.data?.refreshToken || response.data?.token || response.data;

      if (tokenValue) {
        setSession({ refreshToken: tokenValue });
      }

      setMessage(response.message || "Refresh route called successfully.");
    } catch (err) {
      setError(getErrorMessage(err, "Could not refresh token."));
    }
  };

  return (
    <AppShell>
      <PageCard
        title="Your learning command center"
        subtitle="Move between account settings, course publishing, and operational tools from one calmer workspace."
        aside={
          <div className="space-y-5">
            <div className="rounded-[1.5rem] bg-[var(--ink)] p-5 text-white">
              <p className="text-xs uppercase tracking-[0.28em] text-white/65">Signed in</p>
              <p className="mt-3 text-2xl font-extrabold">{user?.username || "Loading"}</p>
              <p className="mt-1 text-sm text-white/72">{user?.email || "Fetching account"}</p>
            </div>
            <button
              type="button"
              onClick={handleRefresh}
              className="w-full rounded-full bg-[var(--brand)] px-4 py-3 text-sm font-bold text-white transition hover:bg-[var(--brand-deep)]"
            >
              Refresh token
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full rounded-full border border-[var(--ink)] px-4 py-3 text-sm font-bold text-[var(--ink)] transition hover:bg-white"
            >
              Logout
            </button>
          </div>
        }
      >
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard label="Role" value={user?.role || "-"} tone="brand" />
          <StatCard
            label="Email status"
            value={user?.isAccountVerified ? "Verified" : "Pending"}
            tone="accent"
          />
          <StatCard label="Courses live" value={courses.length} />
        </div>

        <Notice type="success" message={message} />
        <Notice type="error" message={error} />

        <div className="rounded-[1.8rem] border border-[var(--line)] bg-[rgba(255,255,255,0.62)] p-6">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--brand-deep)]">
            Momentum board
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-[1.25rem] border border-[var(--line)] bg-white/70 p-4">
              <p className="text-sm text-[var(--muted)]">Recommended next step</p>
              <p className="mt-2 font-semibold text-[var(--ink)]">
                {user?.isAccountVerified ? "Build or publish your next course." : "Verify your email to unlock publishing."}
              </p>
            </div>
            <div className="rounded-[1.25rem] border border-[var(--line)] bg-white/70 p-4">
              <p className="text-sm text-[var(--muted)]">Studio readiness</p>
              <p className="mt-2 font-semibold text-[var(--ink)]">
                {user?.role === "teacher" || user?.role === "admin"
                  ? "You can create and manage course drafts."
                  : "Student access is focused on enrollment and profile tools."}
              </p>
            </div>
            <div className="rounded-[1.25rem] border border-[var(--line)] bg-white/70 p-4">
              <p className="text-sm text-[var(--muted)]">Catalog scope</p>
              <p className="mt-2 font-semibold text-[var(--ink)]">
                {courses.length ? `${courses.length} published course${courses.length > 1 ? "s" : ""} ready to browse.` : "No live courses yet."}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <QuickLink
            to="/profile"
            eyebrow="Identity"
            title="Profile"
            description="Update your public details and image so your account feels complete."
          />
          <QuickLink
            to="/verify-email"
            eyebrow="Security"
            title="Verify"
            description="Send OTP, confirm your email, and unlock the publishing workflow."
          />
          <QuickLink
            to="/create-course"
            eyebrow="Studio"
            title="Create"
            description="Spin up a polished course draft with title, description, and cover art."
          />
          <QuickLink
            to="/tools"
            eyebrow="Operations"
            title="Admin tools"
            description="Search, inspect, and manage user accounts from a clearer utility panel."
          />
        </div>
      </PageCard>
    </AppShell>
  );
}
