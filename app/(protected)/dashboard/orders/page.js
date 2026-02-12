"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import socket from "@/services/socket";
import LiveCourierMap from "../../../components/map/LiveCourierMap";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://flipkart1-f0oe.onrender.com/api";

export default function MyOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("PENDING");

  // ✅ ADDED STATE (for tracking)
  const [activeTrackingOrder, setActiveTrackingOrder] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  /* ================= API CALL ================= */

  const loadMyOrders = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");

      if (!token) {
        alert("Not authenticated. Please login again.");
        router.push("/login");
        return;
      }

      const res = await fetch(`${API_URL}/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setOrders(data);
    } catch (err) {
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  /* ================= INITIAL LOAD ================= */

  useEffect(() => {
    loadMyOrders();
  }, []);

  /* ================= SOCKET.IO: ORDER STATUS ================= */

  useEffect(() => {
    socket.on("order-status-updated", ({ orderId, status }) => {
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status } : order
        )
      );
    });

    return () => {
      socket.off("order-status-updated");
    };
  }, []);

  /* ================= SOCKET.IO: JOIN ORDER ROOMS ================= */

  useEffect(() => {
    orders.forEach((order) => {
      socket.emit("join-order", order._id);
    });
  }, [orders]);

  /* ================= LOCATION HANDLER (🟢 ADDED) ================= */

  const startTracking = (orderId) => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported by browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setActiveTrackingOrder(orderId);
      },
      () => {
        alert("Location permission denied");
      }
    );
  };

  /* ================= UI HELPERS ================= */

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
        return "🚚 Courier on the way (live tracking available)";
      case "DELIVERED":
        return "🎉 Order delivered successfully!";
      case "REJECTED":
        return "❌ Order rejected by seller";
      default:
        return status;
    }
  };

  /* ================= RENDER ================= */

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
            <p className="text-gray-600">Track your orders (live)</p>
          </div>
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg"
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
              className={`px-6 py-2 rounded-lg font-semibold ${
                filter === status
                  ? "bg-blue-600 text-white"
                  : "bg-white border-2 border-gray-300"
              }`}
            >
              {status} ({orders.filter((o) => o.status === status).length})
            </button>
          ))}
        </div>

        {/* Orders */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-2xl text-gray-600">
              No {filter.toLowerCase()} orders
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
                {/* Header */}
                <div className="flex justify-between mb-4 pb-4 border-b">
                  <div>
                    <h3 className="text-2xl font-bold">
                      Order #{order._id.slice(-8).toUpperCase()}
                    </h3>
                    <p className="text-gray-600">
                      📅 {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-4 py-2 rounded-full font-bold ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                    <p className="text-sm text-gray-600 mt-2">
                      {getStatusMessage(order.status)}
                    </p>
                  </div>
                </div>

                {/* Products */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  {order.products.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center"
                    >
                      <div>
                        <p className="font-semibold">
                          {item.product?.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <span className="font-bold">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="grid grid-cols-2 bg-indigo-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="text-2xl font-bold">
                      ₹{order.totalAmount}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Seller</p>
                    <p className="text-lg font-semibold">
                      {order.seller?.name}
                    </p>
                  </div>
                </div>

                {/* 🚚 TRACK BUTTON (🟢 ADDED) */}
                {order.status === "CONFIRMED" && (
                  <div className="mt-4">
                    <button
                      onClick={() => startTracking(order._id)}
                      className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800"
                    >
                      📍 Track Live Order
                    </button>
                  </div>
                )}

                {/* 🗺️ LIVE MAP (🟢 ADDED) */}
                {activeTrackingOrder === order._id && userLocation && (
                  <LiveCourierMap
                    orderId={order._id}
                    userLat={userLocation.lat}
                    userLng={userLocation.lng}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
