"use client";

import React, { useState } from "react";
import axiosInstance from "@/utils/axios";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter(); // ✅ router ব্যবহার করতে হলে এটি লাগবে
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      if (res.data.success) {
        const { accessToken } = res.data.data;
        localStorage.setItem("accessToken", accessToken);
        alert("Login successful!");
        router.push("/");
      } else {
        setError("Login failed");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <form onSubmit={handleLogin} className="max-w-md mx-auto p-4">
      <h2 className="text-2xl mb-4">Login</h2>
      {error && <p className="text-red-600 mb-2">{error}</p>}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full p-2 border rounded mb-4"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full p-2 border rounded mb-4"
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Login
      </button>
    </form>
  );
}
