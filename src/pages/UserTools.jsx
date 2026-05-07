import { useEffect, useState } from "react";
import AppShell from "../components/AppShell";
import Notice from "../components/Notice";
import PageCard from "../components/PageCard";
import {
  deleteUser,
  fetchAllUsers,
  findUserByEmail,
  getErrorMessage,
} from "../lib/api";

export default function UserTools() {
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await fetchAllUsers();
        setUsers(response.data || []);
      } catch (err) {
        setError(getErrorMessage(err, "Could not fetch users."));
      }
    };

    loadUsers();
  }, []);

  const handleSearch = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await findUserByEmail(email);
      setSelectedUser(response.data);
      setMessage(response.message || "User fetched successfully.");
    } catch (err) {
      setSelectedUser(null);
      setError(getErrorMessage(err, "Could not find user by email."));
    }
  };

  const handleDelete = async () => {
    if (!email) {
      setError("Enter an email before deleting a user.");
      return;
    }

    setError("");
    setMessage("");

    try {
      const response = await deleteUser(email);
      setMessage(response.message || "User deleted successfully.");
      setSelectedUser(null);
      setUsers((current) => current.filter((user) => user.email !== email));
    } catch (err) {
      setError(getErrorMessage(err, "Could not delete user."));
    }
  };

  return (
    <AppShell>
      <PageCard
        title="User operations"
        subtitle="A cleaner utility space for inspecting accounts, searching by email, and removing test users when needed."
        aside={
          <div className="space-y-4">
            <div className="rounded-[1.5rem] bg-[var(--ink)] p-5 text-white">
              <p className="text-xs uppercase tracking-[0.28em] text-white/65">Dataset</p>
              <p className="mt-3 text-4xl font-extrabold">{users.length}</p>
              <p className="mt-2 text-sm leading-7 text-white/74">
                Users currently returned by the backend.
              </p>
            </div>
          </div>
        }
      >
        <Notice type="success" message={message} />
        <Notice type="error" message={error} />

        <form onSubmit={handleSearch} className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto_auto]">
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Search or delete by email"
            className="rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-4 outline-none transition focus:border-[var(--brand)]"
            required
          />
          <button
            type="submit"
            className="rounded-full bg-[var(--ink)] px-5 py-3 font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[var(--brand-deep)]"
          >
            Find user
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-full border border-[rgba(138,47,34,0.25)] px-5 py-3 font-bold uppercase tracking-[0.12em] text-[var(--error-ink)] transition hover:bg-[var(--error)]"
          >
            Delete user
          </button>
        </form>

        {selectedUser ? (
          <div className="rounded-[1.6rem] border border-[var(--line)] bg-[var(--paper-strong)] p-5">
            <p className="text-lg font-bold text-[var(--ink)]">{selectedUser.username}</p>
            <p className="text-[var(--muted)]">{selectedUser.email}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
              {selectedUser.role} | {selectedUser.isAccountVerified ? "verified" : "unverified"}
            </p>
          </div>
        ) : null}

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {users.map((user) => (
            <article
              key={user._id}
              className="rounded-[1.5rem] border border-[var(--line)] bg-white/80 p-5 shadow-[0_16px_32px_rgba(51,34,23,0.05)]"
            >
              <p className="text-lg font-bold text-[var(--ink)]">{user.username}</p>
              <p className="mt-1 text-sm text-[var(--muted)]">{user.email}</p>
              <p className="mt-3 text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                {user.role} | {user.isAccountVerified ? "verified" : "unverified"}
              </p>
            </article>
          ))}
        </div>
      </PageCard>
    </AppShell>
  );
}
