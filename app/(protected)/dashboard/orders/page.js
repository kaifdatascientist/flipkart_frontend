"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = typeof window !== 'undefined' && process.env.NEXT_PUBLIC_API_URL 
  ? process.env.NEXT_PUBLIC_API_URL.replace('/products', '/orders') 
  : "https://flipkart1-f0oe.onrender.com/api/orders";

export default function MyOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("PENDING");

  /* ================= API CALLS ================= */

  const loadMyOrders = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");

      if (!token) {
        alert("Not authenticated. Please login again.");
        router.push("/login");
        return;
      }

      console.log("📦 Loading my orders...");

      const res = await fetch(`${API_URL}/my`, {
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
    } catch (err) {
      console.error("❌ Load orders error:", err);
      alert(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  /* ================= LIFECYCLE ================= */

  useEffect(() => {
    loadMyOrders();
  }, []);

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

  const getStatusMessage = (status) => {
    switch (status) {
      case "PENDING":
        return "⏳ Waiting for seller confirmation...";
      case "CONFIRMED":
        return "✅ Order confirmed! Preparing to ship";
      case "DELIVERED":
        return "🎉 Order delivered successfully!";
      case "REJECTED":
        return "❌ Order rejected by seller";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading your orders...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">📦 My Orders</h1>
            <p className="text-gray-600">Track your orders</p>
          </div>
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg transition"
          >
            ← Back to Shopping
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-4 mb-8 flex-wrap">
          {["PENDING", "CONFIRMED", "DELIVERED", "REJECTED"].map((status) => (
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
              onClick={() => router.push("/dashboard")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg"
            >
              Continue Shopping
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
                      📅 {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-4 py-2 rounded-full font-bold ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    <p className="text-sm text-gray-600 mt-2">{getStatusMessage(order.status)}</p>
                  </div>
                </div>

                {/* Products */}
                <div className="mb-6 bg-gray-50 rounded-lg p-4">
                  <h4 className="font-bold text-gray-900 mb-3">📦 Products:</h4>
                  <div className="space-y-2">
                    {order.products && order.products.length > 0 ? (
                      order.products.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{item.product?.name || "Unknown Product"}</p>
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          </div>
                          <span className="font-bold text-gray-900">₹{item.price * item.quantity}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-600">No products</p>
                    )}
                  </div>
                </div>

                {/* Order Total */}
                <div className="grid grid-cols-2 gap-4 bg-indigo-50 p-4 rounded-lg">
                  <div>
                    <p className="text-gray-600 text-sm">Total Amount</p>
                    <p className="text-2xl font-bold text-gray-900">₹{order.totalAmount}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Seller</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {order.seller?.name || "Unknown Seller"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
