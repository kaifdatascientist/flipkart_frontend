const API_URL = "https://flipkart1-f0oe.onrender.com/api";

/* ===========================
   HELPER: AUTH HEADER
=========================== */
const authHeader = () => ({
  Authorization: `Bearer ${sessionStorage.getItem("token")}`,
});

/* ===========================
   PRODUCTS
=========================== */

// GET ALL PRODUCTS (public)
export const getProducts = async () => {
  const res = await fetch(`${API_URL}/products`);
  return res.json();
};

// CREATE PRODUCT (admin only)
export const createProduct = async (data) => {
  const res = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Create product failed");
  }

  return res.json();
};

// UPDATE PRODUCT (admin only)
export const updateProduct = async (id, data) => {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Update product failed");
  }

  return res.json();
};

// DELETE PRODUCT (admin only)
export const deleteProduct = async (id) => {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
    headers: {
      ...authHeader(),
    },
  });

  if (!res.ok) {
    throw new Error("Delete product failed");
  }

  return res.json();
};

/* ===========================
   AUTH
=========================== */

export const loginUser = async (data) => {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  return res.json();
};

export const registerUser = async (data) => {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Register failed");
  }

  return res.json();
};
