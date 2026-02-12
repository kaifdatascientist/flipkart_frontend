"use client";

import { useState } from "react";
import { registerUser } from "@/services/api";
import { useRouter } from "next/navigation";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer", // Default role
  });

  const router = useRouter();

  const submit = async () => {
    try {
      await registerUser(form);
      alert("Registration successful! Please login.");
      router.push("/auth/login");
    } catch (err) {
      alert(err.message || "Registration failed");
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl bg-gray-900 p-8 shadow-2xl border border-gray-800">
      <h1 className="text-3xl font-bold text-white text-center mb-2">
        Create Account
      </h1>

      <p className="text-gray-400 text-center mb-6">
        Join LoginExpress today
      </p>

      <div className="space-y-4">
        <input
          className="w-full rounded-lg bg-gray-800 px-4 py-3 text-white"
          placeholder="Name"
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          className="w-full rounded-lg bg-gray-800 px-4 py-3 text-white"
          placeholder="Email"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          className="w-full rounded-lg bg-gray-800 px-4 py-3 text-white"
          placeholder="Password"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        {/* Role Selection */}
        <div className="bg-gray-800 rounded-lg p-4">
          <label className="text-white font-semibold mb-2 block">
            Account Type
          </label>
          <div className="space-y-2">
            <label className="flex items-center text-gray-300 cursor-pointer">
              <input
                type="radio"
                name="role"
                value="customer"
                checked={form.role === "customer"}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="mr-2"
              />
              👤 I'm a Customer (Buy Products)
            </label>
            <label className="flex items-center text-gray-300 cursor-pointer">
              <input
                type="radio"
                name="role"
                value="admin"
                checked={form.role === "admin"}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="mr-2"
              />
              🏪 I'm a Seller (Sell Products)
            </label>
          </div>
        </div>

        <button
          onClick={submit}
          className="w-full rounded-lg bg-green-600 py-3 font-semibold text-white hover:bg-green-700 transition"
        >
          Register
        </button>
      </div>

      <p className="text-gray-400 text-center mt-6">
        Already have an account?{" "}
        <a href="/auth/login" className="text-blue-500 hover:text-blue-400">
          Login
        </a>
      </p>
    </div>
  );
}
