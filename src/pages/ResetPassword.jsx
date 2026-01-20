import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setnewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      return setError("Passwords do not match");
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/reset-password/${token}`,
        { newPassword }
      );

      setMessage(res.data.message || "Password reset successful");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Invalid or expired reset token"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md w-96 flex flex-col gap-4"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Reset Password
        </h2>

        {message && (
          <p className="text-green-600 text-sm text-center bg-green-50 py-2 rounded">
            {message}
          </p>
        )}

        {error && (
          <p className="text-red-500 text-sm text-center bg-red-50 py-2 rounded">
            {error}
          </p>
        )}

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setnewPassword(e.target.value)}
          required
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
