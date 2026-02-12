"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedRole = sessionStorage.getItem("role");
    setRole(storedRole);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
    router.replace("/login");
  };

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-blue-600 text-white">
      <h1
        className="font-bold text-xl cursor-pointer"
        onClick={() => router.push("/dashboard")}
      >
        LoginExpress
      </h1>

      <div className="flex gap-4">
        {/* ✅ ADMIN BUTTON */}
        {role === "admin" && (
          <button
            onClick={() => router.push("/admin/products")}
            className="bg-green-600 px-4 py-2 rounded"
          >
            Admin Panel
          </button>
        )}

        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
