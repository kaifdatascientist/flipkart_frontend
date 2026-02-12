"use client";

import { useState } from "react";
import { loginUser } from "@/services/api";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const submit = async () => {
    try {
      const res = await loginUser({ email, password });

      // ✅ STORE TOKEN + ROLE
      sessionStorage.setItem("token", res.token);
      sessionStorage.setItem("role", res.role);

      // ✅ REDIRECT BASED ON ROLE
      if (res.role === "admin") {
        router.replace("/admin/products");
      } else {
        router.replace("/dashboard");
      }
    } catch (err) {
      alert(err.message || "Login failed");
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl bg-gray-900 p-8 shadow-2xl border border-gray-800">
      <h1 className="text-3xl font-bold text-white text-center mb-2">
        Login
      </h1>

      <p className="text-gray-400 text-center mb-6">
        Welcome back
      </p>

      <div className="space-y-4">
        <input
          className="w-full rounded-lg bg-gray-800 px-4 py-3 text-white"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full rounded-lg bg-gray-800 px-4 py-3 text-white"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={submit}
          className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white"
        >
          Login
        </button>
      </div>
    </div>
  );
}
