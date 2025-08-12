import { useState, useEffect } from "react";

export const useAuth = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      const token = localStorage.getItem("accessToken");

      if (userStr) {
        setUser(JSON.parse(userStr));
      }
      if (token && userStr) {
        setIsAuthenticated(true);
      }
      setLoading(false);
    }
  }, []);

  const isAdmin = user?.role === "admin";

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    }
    setUser(null);
    setIsAuthenticated(false);
  };

  return { user, loading, isAuthenticated, isAdmin, logout };
};
