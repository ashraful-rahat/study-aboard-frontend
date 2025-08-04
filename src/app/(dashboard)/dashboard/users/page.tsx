"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axios"; // adjust path if needed

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get("/users");

        // Check if data is wrapped
        const usersArray = Array.isArray(response.data)
          ? response.data
          : response.data.data;

        setUsers(usersArray);
      } catch (err: any) {
        console.error(
          "❌ Error fetching users:",
          err.response || err.message || err
        );
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">All Users</h1>
      <ul>
        {users.map((user: any) => (
          <li key={user._id}>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersPage;
