"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/context/cardcontext";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        console.log("🔥 Fetching products from dashboard...");
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        console.log("📍 API URL:", API_URL);
        
        if (!API_URL) {
          throw new Error("API URL not configured");
        }

        const res = await fetch(`${API_URL}/products`);
        console.log("📋 Response status:", res.status);
        
        if (!res.ok) {
          throw new Error(`Failed to fetch products: ${res.status}`);
        }
        
        const data = await res.json();
        console.log("🔥 Products:", data);
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("❌ Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const buyNow = async (product) => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      return;
    }

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      console.log("📍 Placing order to:", `${API_URL}/orders/place`);
      
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

      alert("✅ Order placed successfully");
    } catch (err) {
      console.error("❌ Order error:", err);
      alert("Something went wrong: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Loading products...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        🛍️ Products
      </h1>

      {products.length === 0 ? (
        <div className="bg-white p-10 rounded shadow text-center text-gray-600">
          No products available
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              addToCart={addToCart}
              buyNow={buyNow}
            />
          ))}
        </div>
      )}
    </div>
  );
}
