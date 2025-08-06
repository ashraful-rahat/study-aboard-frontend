"use client";
import axiosInstance from "@/utils/axios";
import React, { useState, useEffect, ChangeEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

interface IUser {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  role: "admin" | "user" | "moderator";
  status: "active" | "inactive" | "suspended";
  photo?: string;
  phone?: string | null;
  address?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

const UsersPage = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<IUser | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const [userData, setUserData] = useState<IUser>({
    name: "",
    email: "",
    password: "",
    role: "user",
    status: "active",
    photo: "",
    phone: "",
    address: "",
  });

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/users");
      const usersArray = Array.isArray(response.data)
        ? response.data
        : response.data.data || [];
      setUsers(usersArray);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      
      if (error.response?.status === 404) {
        alert("Users API endpoint not found. Please check the backend server.");
      } else if (error.response?.status === 401) {
        alert("Unauthorized. Please check your authentication.");
      } else {
        alert(`Failed to fetch users: ${error.response?.data?.message || error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // Test available endpoints
    testEndpoints();
  }, []);

  // Test function to check available endpoints
  const testEndpoints = async () => {
    const endpoints = [
      "/users",
      "/auth/register", 
      "/users/register",
      "/auth/users",
      "/admin/users"
    ];
    
    console.log("Testing available endpoints...");
    for (const endpoint of endpoints) {
      try {
        const response = await axiosInstance.get(endpoint);
        console.log(`✅ ${endpoint} - Status: ${response.status}`);
      } catch (error: any) {
        console.log(`❌ ${endpoint} - Status: ${error.response?.status || 'No response'}`);
      }
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (e.target instanceof HTMLInputElement && e.target.type === "file") {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const file = e.target.files ? e.target.files[0] : null;
      // Handle file upload logic here if needed
    } else {
      setUserData({ ...userData, [name]: value });
    }
  };

  const resetForm = () => {
    setUserData({
      name: "",
      email: "",
      password: "",
      role: "user",
      status: "active",
      photo: "",
      phone: "",
      address: "",
    });
    setEditingUser(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", userData.name);
    formData.append("email", userData.email);
    formData.append("role", userData.role);
    formData.append("status", userData.status);

    if (userData.password) {
      formData.append("password", userData.password);
    }

    if (userData.phone) {
      formData.append("phone", userData.phone);
    }

    if (userData.address) {
      formData.append("address", userData.address);
    }

    // Handle file upload if needed
    const fileInput = document.querySelector(
      'input[name="photo"]'
    ) as HTMLInputElement;
    if (fileInput && fileInput.files && fileInput.files[0]) {
      formData.append("photo", fileInput.files[0]);
    }

    try {
      if (editingUser?._id) {
        // Update existing user
        await axiosInstance.put(`/users/${editingUser._id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        alert("User updated successfully!");
      } else {
        // Create new user - try different endpoints
        try {
          await axiosInstance.post("/auth/register", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        } catch (error: any) {
          if (error.response?.status === 404) {
            // Try alternative endpoint
            await axiosInstance.post("/users", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
          } else {
            throw error;
          }
        }
        alert("User created successfully!");
      }

      fetchUsers();
      resetForm();
      setShowForm(false);
    } catch (error: any) {
      console.error("Error:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      
      if (error.response?.status === 404) {
        alert("API endpoint not found. Please check the backend server.");
      } else if (error.response?.status === 400) {
        alert("Invalid data. Please check your input.");
      } else if (error.response?.status === 401) {
        alert("Unauthorized. Please check your authentication.");
      } else if (error.response?.status === 500) {
        alert("Server error. Please try again later.");
      } else {
        alert(`An error occurred: ${error.response?.data?.message || error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: IUser) => {
    setEditingUser(user);
    setUserData({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      status: user.status,
      photo: user.photo || "",
      phone: user.phone || "",
      address: user.address || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/users/${id}`);
      alert("User deleted successfully!");
      fetchUsers();
      setDeleteConfirm(null);
    } catch (error: any) {
      console.error("Error deleting user:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      
      if (error.response?.status === 404) {
        alert("User not found or already deleted.");
      } else if (error.response?.status === 401) {
        alert("Unauthorized. Please check your authentication.");
      } else {
        alert(`Failed to delete user: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      await axiosInstance.put(`/users/${userId}`, { status: newStatus });
      fetchUsers();
      alert("User status updated successfully!");
    } catch (error: any) {
      console.error("Error updating user status:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      
      if (error.response?.status === 404) {
        alert("User not found.");
      } else if (error.response?.status === 401) {
        alert("Unauthorized. Please check your authentication.");
      } else {
        alert(`Failed to update user status: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phone &&
        user.phone.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "moderator":
        return "bg-blue-100 text-blue-800";
      case "user":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "inactive":
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "suspended":
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                User Management
              </h1>
              <p className="text-gray-600 mt-2">
                Manage all users and their permissions
              </p>
            </div>
            <Button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Add New User
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <Input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="moderator">Moderator</option>
              <option value="user">User</option>
            </select>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {filteredUsers.length}
              </div>
              <div className="text-sm text-gray-600">Total Users</div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <motion.tr
                      key={user._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                            {user.photo ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={user.photo}
                                alt={user.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <svg
                                className="w-6 h-6 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                              </svg>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {user.phone || "No phone"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.address || "No address"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(
                            user.role
                          )}`}
                        >
                          {user.role.charAt(0).toUpperCase() +
                            user.role.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                              user.status
                            )}`}
                          >
                            {getStatusIcon(user.status)}
                            <span className="ml-1">
                              {user.status.charAt(0).toUpperCase() +
                                user.status.slice(1)}
                            </span>
                          </span>
                          <select
                            value={user.status}
                            onChange={(e) =>
                              handleStatusChange(user._id!, e.target.value)
                            }
                            className="text-xs border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-orange-500"
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="suspended">Suspended</option>
                          </select>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.createdAt ? formatDate(user.createdAt) : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Button
                            onClick={() => handleEdit(user)}
                            variant="outline"
                            size="sm"
                            className="text-blue-600 hover:text-blue-900 border-blue-600 hover:bg-blue-50"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </Button>
                          <Button
                            onClick={() => setDeleteConfirm(user._id!)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-900 border-red-600 hover:bg-red-50"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No users found
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm
                      ? "Try adjusting your search terms."
                      : "Get started by creating a new user."}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Form Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowForm(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {editingUser ? "Edit User" : "Add New User"}
                    </h2>
                    <Button
                      onClick={() => setShowForm(false)}
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </Button>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <Input
                        type="text"
                        name="name"
                        value={userData.name}
                        onChange={handleChange}
                        required
                        placeholder="Enter full name"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email *
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={userData.email}
                        onChange={handleChange}
                        required
                        placeholder="Enter email address"
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {editingUser
                          ? "New Password (leave blank to keep current)"
                          : "Password *"}
                      </label>
                      <Input
                        type="password"
                        name="password"
                        value={userData.password}
                        onChange={handleChange}
                        required={!editingUser}
                        placeholder="Enter password"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone
                      </label>
                      <Input
                        type="tel"
                        name="phone"
                        value={userData.phone || ""}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={userData.address || ""}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Enter address"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Role *
                      </label>
                      <select
                        name="role"
                        value={userData.role}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
                      >
                        <option value="user">User</option>
                        <option value="moderator">Moderator</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Status *
                      </label>
                      <select
                        name="status"
                        value={userData.status}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Profile Photo
                    </label>
                    <Input
                      type="file"
                      name="photo"
                      onChange={handleChange}
                      accept="image/*"
                      className="w-full"
                    />
                  </div>

                  <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
                    <Button
                      type="button"
                      onClick={() => setShowForm(false)}
                      variant="outline"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          {editingUser ? "Updating..." : "Creating..."}
                        </div>
                      ) : editingUser ? (
                        "Update User"
                      ) : (
                        "Create User"
                      )}
                    </Button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {deleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setDeleteConfirm(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                    <svg
                      className="h-6 w-6 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Delete User
                  </h3>
                  <p className="text-sm text-gray-500 mb-6">
                    Are you sure you want to delete this user? This action
                    cannot be undone.
                  </p>
                  <div className="flex items-center justify-center space-x-3">
                    <Button
                      onClick={() => setDeleteConfirm(null)}
                      variant="outline"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => handleDelete(deleteConfirm)}
                      className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UsersPage;
