import { useState } from "react";
import AppShell from "../components/AppShell";
import Notice from "../components/Notice";
import PageCard from "../components/PageCard";
import { getErrorMessage, sendVerifyOtp, verifyEmail } from "../lib/api";
import { getStoredUser, setSession } from "../lib/auth";

export default function VerifyEmail() {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [otpPreview, setOtpPreview] = useState("");
  const user = getStoredUser();

  const handleSendOtp = async () => {
    setError("");
    setMessage("");

    try {
      const response = await sendVerifyOtp(user?._id);
      setOtpPreview(response.otp || "");
      setMessage(response.message || "OTP sent successfully.");
    } catch (err) {
      setError(getErrorMessage(err, "Could not send verification OTP."));
    }
  };

  const handleVerify = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await verifyEmail(user?._id, otp);
      setSession({
        user: {
          ...user,
          isAccountVerified: true,
        },
      });
      setMessage(response.message || "Email verified successfully.");
    } catch (err) {
      setError(getErrorMessage(err, "Could not verify email."));
    }
  };

  return (
    <AppShell>
      <PageCard
        title="Verify your email"
        subtitle="Confirm your account before publishing courses or unlocking the full teacher workflow."
        aside={
          <div className="space-y-4">
            <div className="rounded-[1.5rem] bg-[var(--ink)] p-5 text-white">
              <p className="text-xs uppercase tracking-[0.28em] text-white/65">Current status</p>
              <p className="mt-3 text-3xl font-extrabold">
                {user?.isAccountVerified ? "Verified" : "Unverified"}
              </p>
              <p className="mt-2 text-sm leading-7 text-white/74">
                The backend currently returns the OTP in the response, so it is shown here for local development convenience.
              </p>
            </div>
            {otpPreview ? (
              <div className="rounded-[1.5rem] border border-[rgba(201,101,59,0.18)] bg-[rgba(201,101,59,0.1)] px-4 py-4 text-center text-3xl font-black tracking-[0.38em] text-[var(--brand-deep)]">
                {otpPreview}
              </div>
            ) : null}
          </div>
        }
      >
        <Notice type="success" message={message} />
        <Notice type="error" message={error} />

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleSendOtp}
            className="rounded-full bg-[var(--ink)] px-5 py-3 font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[var(--brand-deep)]"
          >
            Send verification OTP
          </button>
        </div>

        <form onSubmit={handleVerify} className="max-w-md space-y-4">
          <input
            type="text"
            inputMode="numeric"
            value={otp}
            onChange={(event) => setOtp(event.target.value)}
            placeholder="Enter the 6-digit OTP"
            className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-4 outline-none transition focus:border-[var(--brand)]"
            required
          />
          <button
            type="submit"
            className="rounded-full bg-[var(--brand)] px-5 py-3 font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[var(--brand-deep)]"
          >
            Verify email
          </button>
        </form>
      </PageCard>
    </AppShell>
  );
}
