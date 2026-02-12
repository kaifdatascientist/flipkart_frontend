// Get API URL - works in both dev and production
const getApiUrl = () => {
  // In browser
  if (typeof window !== 'undefined') {
    const envUrl = process.env.NEXT_PUBLIC_API_URL;
    if (envUrl) {
      console.log("📍 API URL from env:", envUrl);
      return envUrl;
    }
  }
  
  // Fallback - production Render URL
  const fallbackUrl = "https://flipkart1-f0oe.onrender.com/api";
  console.log("📍 Using fallback API URL:", fallbackUrl);
  return fallbackUrl;
};

const API_URL = getApiUrl();

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
  try {
    const url = `${API_URL}/products`;
    console.log("🔥 Fetching products from:", url);
    
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    
    console.log("📋 Response status:", res.status, res.statusText);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ API Error:", res.status, errorText);
      throw new Error(`API Error: ${res.status} - ${errorText}`);
    }
    
    const data = await res.json();
    console.log("✅ Products fetched successfully:", data.length, "items");
    return data;
  } catch (error) {
    console.error("❌ Failed to fetch products:", error.message);
    throw error;
  }
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
  try {
    console.log("🔐 Attempting login with:", data.email);
    console.log("📍 API URL:", `${API_URL}/login`);
    
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: 'include',
    });

    console.log("📊 Response status:", res.status);
    
    if (!res.ok) {
      const error = await res.text();
      console.error("❌ Login error response:", error);
      throw new Error(`Login failed: ${res.status} - ${error}`);
    }

    const result = await res.json();
    console.log("✅ Login successful!", result);
    return result;
  } catch (error) {
    console.error("🔴 Login exception:", error.message);
    throw error;
  }
};

export const registerUser = async (data) => {
  try {
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Register failed: ${res.status} - ${error}`);
    }

    return res.json();
  } catch (error) {
    console.error("Register error:", error);
    throw error;
  }
};
