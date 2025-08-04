"use client";

import axiosInstance from "@/utils/axios";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Register = () => {
  const router = useRouter(); // router এখানে declare করা হয়েছে

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPhotoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("password", formData.password);
      if (formData.phone) data.append("phone", formData.phone);
      if (formData.address) data.append("address", formData.address);
      if (photoFile) data.append("photo", photoFile);

      const response = await axiosInstance.post("/auth/register", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const token = response.data.data?.accessToken;
      if (token) {
        localStorage.setItem("accessToken", token);
        console.log("Token saved:", token);
      }

      alert("User registered successfully!");
      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        address: "",
      });
      setPhotoFile(null);
      router.push("/"); // ব্যবহারকারীকে সফল রেজিস্ট্রেশনের পর অন্য কোনো পেজে রিডাইরেক্ট করা হচ্ছে
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Registration failed:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      {" "}
      <h2 className="text-2xl font-bold mb-6 text-center">
        Register User with Photp{" "}
      </h2>{" "}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}{" "}
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          required
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        {/* Email */}{" "}
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        {/* Password */}{" "}
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
          minLength={6}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        {/* Phone */}{" "}
        <input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        {/* Address */}{" "}
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
          className="w-full border border-gray-300 rounded px-3 py-2"
          rows={3}
        />
        {/* Photo Upload */}{" "}
        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="w-full"
        />{" "}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded text-white ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Registering..." : "Register"}{" "}
        </button>{" "}
      </form>{" "}
    </div>
  );
};

export default Register;
