"use client";

import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">📊 Seller Dashboard</h1>
        <p className="text-gray-600 mb-8">Manage your products and orders</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Products Management */}
          <div
            onClick={() => router.push("/admin/products")}
            className="bg-white rounded-lg shadow-lg p-8 cursor-pointer hover:shadow-xl transition-all"
          >
            <div className="text-4xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">My Products</h2>
            <p className="text-gray-600 mb-4">Create, edit, and manage your products</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-lg transition">
              Go to Products →
            </button>
          </div>

          {/* Orders Management */}
          <div
            onClick={() => router.push("/admin/orders")}
            className="bg-white rounded-lg shadow-lg p-8 cursor-pointer hover:shadow-xl transition-all"
          >
            <div className="text-4xl mb-4">📋</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Orders</h2>
            <p className="text-gray-600 mb-4">View pending orders and confirm/reject them</p>
            <button className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2 rounded-lg transition">
              View Orders →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
