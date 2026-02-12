"use client";

import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://flipkart1-fo0e.onrender.com/api";

/* ================= HEALTH CHECK (NON-BLOCKING) ================= */

const testConnection = async () => {
  try {
    const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "https://flipkart1-fo0e.onrender.com";
    const res = await fetch(`${SOCKET_URL}/health`);
    await res.json();
    console.log("✅ Backend reachable");
    return true;
  } catch {
    console.warn("⚠ Backend health check failed (continuing anyway)");
    return false; // ⚠ DO NOT BLOCK UI
  }
};

/* ================= API CALLS ================= */

const getSellerProducts = async () => {
  const token = sessionStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");

  // 🔴 IMPORTANT: confirm this route exists in backend
  const res = await fetch(`${API_URL}/seller/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error(`Seller products failed (${res.status})`);
  }

  return res.json();
};

const getAllProducts = async () => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("All products fetch failed");
  return res.json();
};

const createProduct = async (formData) => {
  const token = sessionStorage.getItem("token");

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!res.ok) throw new Error("Create product failed");
  return res.json();
};

const updateProduct = async (id, formData) => {
  const token = sessionStorage.getItem("token");

  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!res.ok) throw new Error("Update product failed");
  return res.json();
};

const deleteProduct = async (id) => {
  const token = sessionStorage.getItem("token");

  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Delete product failed");
};

/* ================= PAGE ================= */

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", stock: 0 });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadProducts = async () => {
    try {
      console.log("📦 Loading products...");
      await testConnection(); // ⚠ non-blocking

      let data;
      try {
        data = await getSellerProducts();
        console.log("✅ Loaded SELLER products");
      } catch (err) {
        console.warn("⚠ Seller route failed, falling back to ALL products");
        data = await getAllProducts();
      }

      setProducts(data);
    } catch (err) {
      alert(err.message || "Failed to load products");
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  /* ================= CRUD HANDLERS ================= */

  const submit = async () => {
    if (!form.name || !form.price) return alert("Fill all fields");

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("stock", form.stock);

    if (image) formData.append("images", image);

    setLoading(true);
    try {
      editingId
        ? await updateProduct(editingId, formData)
        : await createProduct(formData);

      setForm({ name: "", price: "", stock: 0 });
      setImage(null);
      setPreview(null);
      setEditingId(null);
      loadProducts();
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (p) => {
    setEditingId(p._id);
    setForm({ name: p.name, price: p.price, stock: p.stock || 0 });
    setPreview(p.images?.[0]);
  };

  const remove = async (id) => {
    if (confirm("Delete this product?")) {
      await deleteProduct(id);
      loadProducts();
    }
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">📦 Seller Dashboard</h1>

      {/* ADD / EDIT */}
      <div className="bg-white p-6 rounded shadow mb-8">
        <h2 className="text-xl font-bold mb-4">
          {editingId ? "Edit Product" : "Add Product"}
        </h2>

        <div className="grid md:grid-cols-4 gap-4">
          <input
            placeholder="Product Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="number"
            placeholder="Stock"
            value={form.stock}
            onChange={(e) =>
              setForm({ ...form, stock: Number(e.target.value) || 0 })
            }
            className="border p-2 rounded"
          />
          <input
            type="file"
            onChange={(e) => {
              setImage(e.target.files[0]);
              setPreview(URL.createObjectURL(e.target.files[0]));
            }}
          />
        </div>

        {preview && (
          <img src={preview} className="w-24 h-24 mt-4 object-cover rounded" />
        )}

        <button
          onClick={submit}
          disabled={loading}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded"
        >
          {loading ? "Saving..." : editingId ? "Update" : "Add"}
        </button>
      </div>

      {/* PRODUCTS */}
      <div className="grid md:grid-cols-3 gap-6">
        {products.map((p) => (
          <div key={p._id} className="bg-white p-4 rounded shadow">
            <img
              src={p.images?.[0] || "https://via.placeholder.com/200"}
              className="h-40 w-full object-contain mb-2"
            />
            <h3 className="font-bold">{p.name}</h3>
            <p>₹{p.price}</p>
            <p className={p.stock > 0 ? "text-green-600" : "text-red-600"}>
              Stock: {p.stock}
            </p>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => startEdit(p)}
                className="bg-yellow-500 px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => remove(p._id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
