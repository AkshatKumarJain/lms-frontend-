import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Notice from "../components/Notice";
import { getErrorMessage, resetPassword } from "../lib/api";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await resetPassword(token, newPassword);
      setMessage(response.message || "Password reset successful.");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(getErrorMessage(err, "Invalid or expired reset token."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f9fa] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md border border-[#d1d7dc] bg-white p-8 shadow-[0_8px_24px_rgba(6,12,20,0.08)]"
      >
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#6a6f73]">
          Create new password
        </p>
        <h1 className="font-display mt-3 text-4xl font-black text-[#1c1d1f]">
          Choose a strong password
        </h1>

        <div className="mt-6 space-y-4">
          <Notice type="success" message={message} />
          <Notice type="error" message={error} />

          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            required
            className="w-full border border-[#1c1d1f] px-4 py-4 outline-none"
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
            className="w-full border border-[#1c1d1f] px-4 py-4 outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1c1d1f] px-4 py-4 font-bold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Resetting..." : "Reset password"}
          </button>
        </div>

        <Link to="/login" className="mt-6 block text-sm font-semibold text-[#5624d0] hover:underline">
          Back to login
        </Link>
      </form>
    </div>
  );
}
