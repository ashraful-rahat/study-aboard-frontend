import { useState, useEffect } from "react";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    setUser(userStr ? JSON.parse(userStr) : null);
    setLoading(false);
  }, []);

  const isAuthenticated = !!localStorage.getItem("accessToken") && !!user;
  const isAdmin = user?.role === "admin";

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setUser(null);
  };

  return { user, loading, isAuthenticated, isAdmin, logout };
};
