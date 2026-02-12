"use client";

import { useState } from "react";
import { loginUser } from "@/services/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("🔐 Starting login process...");
      const res = await loginUser({ email, password });

      // ✅ STORE TOKEN + ROLE
      sessionStorage.setItem("token", res.token);
      sessionStorage.setItem("role", res.role);
      console.log("✅ Token stored, redirecting...");

      // ✅ REDIRECT BASED ON ROLE
      if (res.role === "admin") {
        router.replace("/admin/products");
      } else {
        router.replace("/dashboard");
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-gray-900 p-8 shadow-2xl border border-gray-800">
        <h1 className="text-3xl font-bold text-white text-center mb-2">
          🔐 Login
        </h1>

        <p className="text-gray-400 text-center mb-6">
          Sign in to your account
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-900 border border-red-600 rounded-lg text-red-200 text-sm">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full rounded-lg bg-gray-800 px-4 py-3 text-white placeholder-gray-500 border border-gray-700 focus:border-blue-500 focus:outline-none"
            required
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-lg bg-gray-800 px-4 py-3 text-white placeholder-gray-500 border border-gray-700 focus:border-blue-500 focus:outline-none"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-3 rounded-lg transition-colors duration-200"
          >
            {loading ? "🔄 Signing in..." : "✅ Sign In"}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-700 text-center">
          <p className="text-gray-400">
            Don't have an account?{" "}
            <Link href="/register" className="text-blue-500 hover:text-blue-400 font-bold">
              Create one
            </Link>
          </p>
        </div>

        {/* Test Credentials */}
        <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700 text-sm text-gray-300">
          <p className="font-bold mb-2">📝 Test Credentials:</p>
          <p>Email: admin@example.com</p>
          <p>Password: admin123</p>
        </div>
      </div>
    </div>
  );
}
