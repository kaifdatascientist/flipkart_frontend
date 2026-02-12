"use client";

import { useCart } from "@/context/cardcontext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div>Loading...</div>;

  const total = cart.reduce((sum, product) => sum + (product.price || 0), 0);

  /* =========================
     BUY ALL ITEMS
     ========================= */
  const handleBuyAll = async () => {
    if (cart.length === 0) return;

    const token = sessionStorage.getItem("token");
    if (!token) {
      alert("Please login to place order");
      router.push("/login");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/orders/place`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          items: cart.map((product) => ({
            product: product._id,
            quantity: 1,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Order failed");
        return;
      }

      alert("✅ Order Placed!\n\nYour order is PENDING.\nThe seller will confirm it shortly.");
      clearCart();
      router.push("/dashboard");
    } catch (err) {
      alert("Something went wrong while placing order");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     BUY SINGLE ITEM
     ========================= */
  const handleBuySingle = async (product) => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      alert("Please login to place order");
      router.push("/login");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/orders/place`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: [
            {
              product: product._id,
              quantity: 1,
            },
          ],
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Order failed");
        return;
      }

      alert("✅ Order Placed!\n\nYour order is PENDING.\nThe seller will confirm it shortly.");
      removeFromCart(product._id);
    } catch (err) {
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-blue-600 mb-8">
          🛒 Shopping Cart
        </h1>

        {cart.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <p className="text-2xl text-gray-600 mb-4">
              Your cart is empty
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between"
                >
                  <div className="w-20 h-20">
                    <img
                      src={product.images?.[0] || "https://via.placeholder.com/80"}
                      alt={product.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>

                  <div className="flex-1 mx-4">
                    <h3 className="text-lg font-semibold">
                      {product.name}
                    </h3>
                    <span className="text-xl font-bold text-green-600">
                      ₹{product.price}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleBuySingle(product)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                    >
                      Buy Now
                    </button>
                    <button
                      onClick={() => removeFromCart(product._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

              <p className="flex justify-between">
                <span>Items</span>
                <span>{cart.length}</span>
              </p>

              <p className="flex justify-between font-bold text-xl mt-4">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </p>

              <button
                onClick={handleBuyAll}
                disabled={loading}
                className="w-full bg-yellow-500 hover:bg-yellow-600 py-3 mt-6 rounded-lg font-bold"
              >
                {loading ? "Placing Order..." : "Buy All Items"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
