"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        localStorage.removeItem("token");
        router.replace("/login");
      } else {
        setIsAuthenticated(true);

        const timeout = (decoded.exp - currentTime) * 1000;
        const timer = setTimeout(() => {
          localStorage.removeItem("token");
          router.replace("/login");
        }, timeout);

        return () => clearTimeout(timer);
      }
    } catch (err) {
      console.error("Gagal decode token:", err);
      localStorage.removeItem("token");
      router.replace("/login");
    }
  }, [router]);

  return isAuthenticated ? <>{children}</> : null;
}
