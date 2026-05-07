import { useEffect, useState } from "react";
import AppShell from "../components/AppShell";
import Notice from "../components/Notice";
import PageCard from "../components/PageCard";
import { fetchProfile, getErrorMessage, updateProfile } from "../lib/api";
import { getStoredUser, setSession } from "../lib/auth";

export default function Profile() {
  const [user, setUser] = useState(getStoredUser());
  const [username, setUsername] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetchProfile();
        setUser(response.data);
        setUsername(response.data?.username || "");
      } catch (err) {
        setError(getErrorMessage(err, "Could not fetch profile."));
      }
    };

    loadProfile();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const formData = new FormData();
    if (username) {
      formData.append("username", username);
    }
    if (file) {
      formData.append("file", file);
    }

    try {
      const response = await updateProfile(formData);
      setUser(response.data);
      setSession({ user: response.data });
      setMessage(response.message || "Profile updated successfully.");
    } catch (err) {
      setError(getErrorMessage(err, "Could not update profile."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <PageCard
        title="Public profile"
        subtitle="Shape how your learner or instructor identity appears across the platform."
        aside={
          <div className="space-y-4">
            <img
              src={
                user?.ProfilePhotoUrl ||
                "https://placehold.co/600x600/f3eadf/1f1b17?text=Profile"
              }
              alt="Profile"
              className="h-56 w-full rounded-[1.5rem] border border-[var(--line)] object-cover"
            />
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--brand-deep)]">
                Member
              </p>
              <p className="mt-2 text-2xl font-extrabold text-[var(--ink)]">
                {user?.username || "User"}
              </p>
              <p className="text-[var(--muted)]">{user?.email || "No email loaded"}</p>
            </div>
          </div>
        }
      >
        <Notice type="success" message={message} />
        <Notice type="error" message={error} />

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.4rem] border border-[var(--line)] bg-white/70 p-5">
            <p className="text-sm text-[var(--muted)]">Username</p>
            <p className="mt-2 text-xl font-black text-[var(--ink)]">{user?.username || "-"}</p>
          </div>
          <div className="rounded-[1.4rem] border border-[var(--line)] bg-white/70 p-5">
            <p className="text-sm text-[var(--muted)]">Email</p>
            <p className="mt-2 text-xl font-black text-[var(--ink)]">{user?.email || "-"}</p>
          </div>
          <div className="rounded-[1.4rem] border border-[var(--line)] bg-white/70 p-5">
            <p className="text-sm text-[var(--muted)]">Verified</p>
            <p className="mt-2 text-xl font-black text-[var(--ink)]">
              {user?.isAccountVerified ? "Yes" : "No"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Update username"
            className="rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-4 outline-none transition focus:border-[var(--brand)]"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(event) => setFile(event.target.files?.[0] || null)}
            className="rounded-[1.2rem] border border-dashed border-[var(--line)] bg-[var(--paper-strong)] px-4 py-4 text-sm text-[var(--muted)]"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-fit rounded-full bg-[var(--brand)] px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[var(--brand-deep)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Updating..." : "Save profile"}
          </button>
        </form>
      </PageCard>
    </AppShell>
  );
}
