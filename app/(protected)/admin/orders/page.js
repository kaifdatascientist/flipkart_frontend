"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import socket from "@/services/socket";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://flipkart1-f0oe.onrender.com/api";

export default function AdminOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("PENDING");
  const [error, setError] = useState("");

  /* ================= LOAD ORDERS ================= */

  const loadSellerOrders = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }

      const res = await fetch(`${API_URL}/seller`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setOrders(data);
      setError("");
    } catch (err) {
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UPDATE STATUS (FIXED) ================= */

  const updateOrderStatus = async (orderId, status) => {
    try {
      const token = sessionStorage.getItem("token");

      const res = await fetch(`${API_URL}/${orderId}/status`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Status update failed");
      }

      const { order } = await res.json();

      // ✅ UPDATE ADMIN UI IMMEDIATELY
      setOrders((prev) =>
        prev.map((o) =>
          o._id === order._id ? { ...o, status: order.status } : o
        )
      );
    } catch (err) {
      alert(err.message || "Failed to update order");
    }
  };

  /* ================= INITIAL LOAD ================= */

  useEffect(() => {
    loadSellerOrders();
  }, []);

  /* ================= SOCKET: NEW ORDERS ================= */

  useEffect(() => {
    socket.on("new-order", (newOrder) => {
      setOrders((prev) => [newOrder, ...prev]);
    });

    return () => socket.off("new-order");
  }, []);

  const filteredOrders = orders.filter((o) => o.status === filter);

  if (loading) {
    return <div className="p-10 text-xl">Loading orders...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">📋 Orders</h1>

      {/* FILTER TABS */}
      <div className="flex gap-4 mb-6">
        {["PENDING", "CONFIRMED", "REJECTED", "DELIVERED"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded ${
              filter === s ? "bg-blue-600 text-white" : "bg-white border"
            }`}
          >
            {s} ({orders.filter((o) => o.status === s).length})
          </button>
        ))}
      </div>

      {/* ORDERS */}
      {filteredOrders.map((order) => (
        <div key={order._id} className="bg-white p-6 rounded shadow mb-4">
          <div className="flex justify-between mb-2">
            <h3 className="font-bold">
              Order #{order._id.slice(-8).toUpperCase()}
            </h3>
            <span className="font-semibold">{order.status}</span>
          </div>

          {order.products.map((item, i) => (
            <div key={i} className="flex justify-between">
              <span>
                {item.product?.name} × {item.quantity}
              </span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}

          {order.status === "PENDING" && (
            <div className="flex gap-4 mt-4 justify-end">
              <button
                onClick={() =>
                  updateOrderStatus(order._id, "REJECTED")
                }
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Reject
              </button>
              <button
                onClick={() =>
                  updateOrderStatus(order._id, "CONFIRMED")
                }
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Confirm
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
