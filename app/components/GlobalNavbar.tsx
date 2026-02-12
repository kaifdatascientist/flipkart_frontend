"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/context/cardcontext";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import socket from "@/services/socket";

export default function GlobalNavbar() {
  const router = useRouter();
  const { cart } = useCart();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const token = sessionStorage.getItem("token");
    if (!token) return;

    try {
      const decoded: any = jwtDecode(token);
      setUserRole(decoded.role);

      // 🔥 JOIN SOCKET ROOMS
      if (decoded.id) {
        socket.emit("join-user-room", decoded.id);

        if (decoded.role === "admin") {
          socket.emit("join-admin-room");
        }
      }
    } catch (error) {
      console.error("Token decode failed:", error);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("cart");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
    router.push("/auth/login");
  };

  const isCustomer = mounted && userRole === "customer";
  const isAdmin = mounted && userRole === "admin";

  return (
    <nav className="sticky top-0 z-50 bg-blue-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <button
          onClick={() => router.push("/dashboard")}
          className="text-2xl font-bold text-white hover:text-blue-100 transition"
        >
          🛍️ LoginExpress
        </button>

        <div className="flex items-center gap-4">
          {isCustomer && (
            <>
              <button
                onClick={() => router.push("/cart")}
                className="bg-white text-blue-600 font-bold px-4 py-2 rounded-lg"
              >
                🛒 Cart ({cart.length})
              </button>
              <button
                onClick={() => router.push("/dashboard/orders")}
                className="bg-white text-blue-600 font-bold px-4 py-2 rounded-lg"
              >
                📦 My Orders
              </button>
            </>
          )}

          {isAdmin && (
            <button
              onClick={() => router.push("/admin")}
              className="bg-white text-blue-600 font-bold px-4 py-2 rounded-lg"
            >
              📊 Seller Panel
            </button>
          )}

          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
