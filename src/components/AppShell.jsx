import { Link, NavLink, useNavigate } from "react-router-dom";
import { clearSession, getStoredUser, isAuthenticated } from "../lib/auth";

const navItems = [
  { to: "/", label: "Discover" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/profile", label: "Profile" },
  { to: "/verify-email", label: "Verify" },
  { to: "/create-course", label: "Studio" },
  { to: "/tools", label: "Admin" },
];

function NavItem({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `rounded-full px-4 py-2 text-sm font-semibold transition ${
          isActive
            ? "bg-[var(--ink)] text-white shadow-[0_12px_24px_rgba(31,27,23,0.18)]"
            : "text-[var(--muted)] hover:bg-white/70 hover:text-[var(--ink)]"
        }`
      }
    >
      {label}
    </NavLink>
  );
}

export default function AppShell({ children }) {
  const navigate = useNavigate();
  const user = getStoredUser();
  const loggedIn = isAuthenticated();

  const handleLocalLogout = () => {
    clearSession();
    navigate("/login");
  };

  return (
    <div className="min-h-screen text-[var(--ink)]">
      <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[rgba(251,245,236,0.84)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 lg:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--ink)] font-display text-xl font-bold text-[var(--gold)]">
                  LS
                </span>
                <div>
                  <p className="font-display text-2xl font-bold tracking-tight">LearnSphere</p>
                  <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
                    Skill Studio
                  </p>
                </div>
              </Link>
              <div className="hidden h-10 w-px bg-[var(--line)] lg:block" />
              <p className="hidden max-w-sm text-sm leading-6 text-[var(--muted)] lg:block">
                A warmer, creator-first learning hub for discovering, publishing, and
                managing modern courses.
              </p>
            </div>

            <div className="flex flex-col gap-3 lg:items-end">
              <div className="flex flex-wrap items-center gap-2">
                <div className="rounded-full border border-[var(--line)] bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--muted)]">
                  {loggedIn ? user?.role || "member" : "guest"}
                </div>
                {loggedIn ? (
                  <button
                    type="button"
                    onClick={handleLocalLogout}
                    className="rounded-full border border-[var(--ink)] px-4 py-2 text-sm font-bold text-[var(--ink)] transition hover:bg-[var(--ink)] hover:text-white"
                  >
                    Logout
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <Link
                      to="/login"
                      className="rounded-full border border-[var(--ink)] px-4 py-2 text-sm font-bold text-[var(--ink)] transition hover:bg-white"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="rounded-full bg-[var(--brand)] px-4 py-2 text-sm font-bold text-white transition hover:bg-[var(--brand-deep)]"
                    >
                      Join free
                    </Link>
                  </div>
                )}
              </div>
              {loggedIn ? (
                <div className="text-sm text-[var(--muted)]">
                  Signed in as <span className="font-bold text-[var(--ink)]">{user?.username}</span>
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <nav className="flex flex-wrap gap-2">
              {navItems.map((item) => (
                <NavItem key={item.to} {...item} />
              ))}
            </nav>

            <div className="glass-panel rounded-full border border-[var(--line)] px-5 py-3 text-sm text-[var(--muted)] shadow-[0_10px_30px_rgba(48,32,20,0.08)]">
              Build a course, verify your account, then publish and enroll from the same workspace.
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-6 lg:py-10">{children}</main>
    </div>
  );
}
