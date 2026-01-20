import React, { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/forgot-password",
        { email }
      );

      setMessage(
        res.data.message ||
          "If an account exists, a reset link has been sent."
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again."
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
          Forgot Password
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
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
