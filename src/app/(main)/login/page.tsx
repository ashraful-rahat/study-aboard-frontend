"use client";

import React, { useState } from "react";
import axios from "axios";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    try {
      const res = await axios.post("http://localhost:5000/api/v1/auth/login", {
        email,
        password,
      });

      if (res.data.success) {
        const { accessToken } = res.data.data;
        // Save token to localStorage
        localStorage.setItem("accessToken", accessToken);
        alert("Login successful!");

        // TODO: Redirect to dashboard or homepage
        // e.g. router.push('/dashboard');
      } else {
        setError("Login failed");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // Handle error response
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
