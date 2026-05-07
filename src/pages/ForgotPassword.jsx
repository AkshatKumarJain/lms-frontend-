import { useState } from "react";
import { Link } from "react-router-dom";
import Notice from "../components/Notice";
import { forgotPassword, getErrorMessage } from "../lib/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await forgotPassword(email);
      setMessage(
        response.message || "If the account exists, a reset link has been sent."
      );
    } catch (err) {
      setError(getErrorMessage(err, "Could not send reset email."));
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
          Password recovery
        </p>
        <h1 className="font-display mt-3 text-4xl font-black text-[#1c1d1f]">
          Reset your password
        </h1>

        <div className="mt-6 space-y-4">
          <Notice type="success" message={message} />
          <Notice type="error" message={error} />

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="w-full border border-[#1c1d1f] px-4 py-4 outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#a435f0] px-4 py-4 font-bold text-white transition hover:bg-[#8710d8] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </div>

        <Link to="/login" className="mt-6 block text-sm font-semibold text-[#5624d0] hover:underline">
          Back to login
        </Link>
      </form>
    </div>
  );
}
