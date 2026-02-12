"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import GlobalNavbar from "@/app/components/GlobalNavbar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }
    setIsAuthorized(true);
    setMounted(true);
  }, [router]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen">
      {/* ✅ NAVBAR FOR ALL LOGGED-IN USERS */}
      <GlobalNavbar />

      {/* ✅ PAGE CONTENT */}
      <main className="p-6">{children}</main>
    </div>
  );
}
