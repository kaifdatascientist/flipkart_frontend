"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://flipkart1-fo0e.onrender.com/api";

export default function AdminOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("PENDING"); // Filter by status
  const [error, setError] = useState("");

  /* ================= API CALLS ================= */

  const loadSellerOrders = useCallback(async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");

      if (!token) {
        alert("Not authenticated. Please login again.");
        router.push("/login");
        return;
      }

      console.log("📦 Loading seller orders...");

      const res = await fetch(`${API_URL}/orders/seller`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        let errorMsg = "Failed to load orders";
        try {
          const errorData = await res.json();
          errorMsg = errorData.message || errorMsg;
        } catch {}
        throw new Error(errorMsg);
      }

      const data = await res.json();
      console.log("✅ Orders loaded:", data);
      setOrders(data);
      setError("");
    } catch (err) {
      console.error("❌ Load orders error:", err);
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const updateOrderStatus = async (orderId, status) => {
    try {
      const token = sessionStorage.getItem("token");

      console.log(`🔄 Updating order ${orderId} status to ${status}...`);

      const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        let errorMsg = "Failed to update order";
        try {
          const errorData = await res.json();
          errorMsg = errorData.message || errorMsg;
        } catch {}
        throw new Error(errorMsg);
      }

      const updatedOrder = await res.json();
      console.log("✅ Order updated:", updatedOrder);

      // Reload orders
      loadSellerOrders();

      alert(`✅ Order ${status.toLowerCase()} successfully!`);
    } catch (err) {
      console.error("❌ Update order error:", err);
      alert(err.message || "Failed to update order");
    }
  };

  /* ================= LIFECYCLE ================= */

  useEffect(() => {
    loadSellerOrders();
  }, [loadSellerOrders]);

  /* ================= FILTERS & RENDERING ================= */

  const filteredOrders = orders.filter((order) => order.status === filter);

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CONFIRMED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      case "DELIVERED":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">📋 Orders</h1>
            <p className="text-gray-600">Manage customer orders</p>
          </div>
          <button
            onClick={() => router.push("/admin")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg transition"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-4 mb-8 flex-wrap">
          {["PENDING", "CONFIRMED", "REJECTED", "DELIVERED"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                filter === status
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-800 border-2 border-gray-300 hover:border-blue-600"
              }`}
            >
              {status} ({orders.filter((o) => o.status === status).length})
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-2xl text-gray-600 mb-4">
              No {filter.toLowerCase()} orders
            </p>
            <button
              onClick={() => setFilter("PENDING")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg"
            >
              View All Orders
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
                {/* Order Header */}
                <div className="flex justify-between items-start mb-4 pb-4 border-b">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Order #{order._id.slice(-8).toUpperCase()}
                    </h3>
                    <p className="text-gray-600">
                      👤 Customer: <span className="font-semibold">{order.user?.name || "Unknown"}</span>
                    </p>
                    <p className="text-gray-600">
                      📧 Email: <span className="font-semibold">{order.user?.email || "N/A"}</span>
                    </p>
                  </div>
                  <span className={`px-4 py-2 rounded-full font-bold ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                {/* Products */}
                <div className="mb-6 bg-gray-50 rounded-lg p-4">
                  <h4 className="font-bold text-gray-900 mb-3">📦 Products:</h4>
                  <div className="space-y-2">
                    {order.products && order.products.length > 0 ? (
                      order.products.map((item, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span className="text-gray-700">
                            {item.product?.name || "Unknown Product"} (×{item.quantity})
                          </span>
                          <span className="font-semibold">₹{item.price * item.quantity}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-600">No products</p>
                    )}
                  </div>
                </div>

                {/* Order Details */}
                <div className="grid grid-cols-2 gap-4 mb-6 bg-blue-50 p-4 rounded-lg">
                  <div>
                    <p className="text-gray-600 text-sm">Total Amount</p>
                    <p className="text-2xl font-bold text-gray-900">₹{order.totalAmount}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Order Date</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                {order.status === "PENDING" && (
                  <div className="flex gap-4 justify-end">
                    <button
                      onClick={() => updateOrderStatus(order._id, "REJECTED")}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-lg transition"
                    >
                      ❌ Reject Order
                    </button>
                    <button
                      onClick={() => updateOrderStatus(order._id, "CONFIRMED")}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-lg transition"
                    >
                      ✅ Confirm Order
                    </button>
                  </div>
                )}

                {order.status === "CONFIRMED" && (
                  <div className="flex gap-4 justify-end">
                    <button
                      onClick={() => updateOrderStatus(order._id, "DELIVERED")}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg transition"
                    >
                      📦 Mark as Delivered
                    </button>
                  </div>
                )}

                {(order.status === "REJECTED" || order.status === "DELIVERED") && (
                  <div className="text-center text-gray-600 py-3">
                    <p className="font-semibold">Order {order.status.toLowerCase()}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
