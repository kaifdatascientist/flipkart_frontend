"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const role = sessionStorage.getItem("role");

    // Check if user is authenticated AND is admin
    if (!token) {
      router.replace("/auth/login");
      return;
    }

    if (role !== "admin") {
      // Non-admin users cannot access admin panel
      alert("Access denied. Admin panel is only for sellers.");
      router.replace("/dashboard");
      return;
    }

    setAuthorized(true);
  }, [router]);

  if (!authorized) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}
