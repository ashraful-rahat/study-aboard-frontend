"use client";
import axiosInstance from "@/utils/axios";
import React, { useState, useEffect, ChangeEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

interface IApplication {
  _id?: string;
  user: string;
  course: string;
  university: string;
  destination: string;
  sscResult: string;
  hscResult: string;
  ieltsResult: string;
  studentNumber: string;
  email: string;
  photo?: string;
  background: string;
  status: "pending" | "approved" | "rejected" | "under_review";
  remarks?: string | null;
  createdAt?: string;
  updatedAt?: string;
  // Populated fields for display
  userDetails?: {
    name: string;
    email: string;
  };
  courseDetails?: {
    name: string;
  };
  universityDetails?: {
    name: string;
  };
  destinationDetails?: {
    name: string;
  };
}

const ApplicationPage = () => {
  const [applications, setApplications] = useState<IApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingApplication, setEditingApplication] =
    useState<IApplication | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [backgroundFilter, setBackgroundFilter] = useState<string>("all");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [applicationData, setApplicationData] = useState<IApplication>({
    user: "",
    course: "",
    university: "",
    destination: "",
    sscResult: "",
    hscResult: "",
    ieltsResult: "",
    studentNumber: "",
    email: "",
    photo: "",
    background: "",
    status: "pending",
    remarks: "",
  });

  // Fetch all applications
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/applications");
      const applicationsArray = Array.isArray(response.data)
        ? response.data
        : response.data.data || [];
      setApplications(applicationsArray);
    } catch (error) {
      console.error("Error fetching applications:", error);
      alert("Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "file" && e.target instanceof HTMLInputElement) {
      setSelectedFile(e.target.files ? e.target.files[0] : null);
    } else {
      setApplicationData({ ...applicationData, [name]: value });
    }
  };

  const resetForm = () => {
    setApplicationData({
      user: "",
      course: "",
      university: "",
      destination: "",
      sscResult: "",
      hscResult: "",
      ieltsResult: "",
      studentNumber: "",
      email: "",
      photo: "",
      background: "",
      status: "pending",
      remarks: "",
    });
    setEditingApplication(null);
    setSelectedFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    // Prepare data object
    const dataObj = {
      user: applicationData.user,
      course: applicationData.course,
      university: applicationData.university,
      destination: applicationData.destination,
      sscResult: applicationData.sscResult,
      hscResult: applicationData.hscResult,
      ieltsResult: applicationData.ieltsResult,
      studentNumber: applicationData.studentNumber,
      email: applicationData.email,
      background: applicationData.background,
      status: applicationData.status,
      remarks: applicationData.remarks,
    };
  
    const formData = new FormData();
    formData.append("data", JSON.stringify(dataObj));
    if (selectedFile) {
      formData.append("photo", selectedFile);
    }
  
    try {
      if (editingApplication?._id) {
        // Update existing application
        await axiosInstance.patch(
          `/applications/${editingApplication._id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        alert("Application updated successfully!");
      } else {
        // Create new application
        await axiosInstance.post("/create-application", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        alert("Application created successfully!");
      }
  
      fetchApplications();
      resetForm();
      setShowForm(false);
      setSelectedFile(null);
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (application: IApplication) => {
    setEditingApplication(application);
    setApplicationData({
      user: application.user,
      course: application.course,
      university: application.university,
      destination: application.destination,
      sscResult: application.sscResult,
      hscResult: application.hscResult,
      ieltsResult: application.ieltsResult,
      studentNumber: application.studentNumber,
      email: application.email,
      photo: application.photo || "",
      background: application.background,
      status: application.status,
      remarks: application.remarks || "",
    });
    setShowForm(true);
    setSelectedFile(null); // Reset selected file when editing
  };

  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/applications/${id}`);
      alert("Application deleted successfully!");
      fetchApplications();
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting application:", error);
      alert("Failed to delete application");
    }
  };

  const handleStatusChange = async (
    applicationId: string,
    newStatus: string
  ) => {
    try {
      await axiosInstance.patch(`/applications/${applicationId}`, {
        status: newStatus,
      });
      fetchApplications();
      alert("Application status updated successfully!");
    } catch (error) {
      console.error("Error updating application status:", error);
      alert("Failed to update application status");
    }
  };

  const filteredApplications = applications.filter((application) => {
    const matchesSearch =
      application.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.studentNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (application.userDetails?.name &&
        application.userDetails.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" || application.status === statusFilter;
    const matchesBackground =
      backgroundFilter === "all" || application.background === backgroundFilter;

    return matchesSearch && matchesStatus && matchesBackground;
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
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "under_review":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "rejected":
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "under_review":
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "pending":
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const getBackgroundColor = (background: string) => {
    switch (background.toLowerCase()) {
      case "science":
        return "bg-blue-100 text-blue-800";
      case "commerce":
        return "bg-green-100 text-green-800";
      case "arts":
        return "bg-purple-100 text-purple-800";
      case "engineering":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
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
                Application Management
              </h1>
              <p className="text-gray-600 mt-2">
                Manage all student applications and their status
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
              Add New Application
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
                placeholder="Search applications..."
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
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              value={backgroundFilter}
              onChange={(e) => setBackgroundFilter(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
            >
              <option value="all">All Backgrounds</option>
              <option value="science">Science</option>
              <option value="commerce">Commerce</option>
              <option value="arts">Arts</option>
              <option value="engineering">Engineering</option>
            </select>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {filteredApplications.length}
              </div>
              <div className="text-sm text-gray-600">Total Applications</div>
            </div>
          </div>
        </div>

        {/* Applications Table */}
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
                      Student
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Academic Info
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Program Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Background
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applied
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredApplications.map((application) => (
                    <motion.tr
                      key={application._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                            {application.photo ? (
                              <img
                                src={application.photo}
                                alt="Student"
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
                              {application.userDetails?.name ||
                                "Unknown Student"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {application.email}
                            </div>
                            <div className="text-xs text-gray-400">
                              ID: {application.studentNumber}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div>SSC: {application.sscResult || "N/A"}</div>
                          <div>HSC: {application.hscResult || "N/A"}</div>
                          <div>IELTS: {application.ieltsResult || "N/A"}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="font-medium">
                            {application.courseDetails?.name ||
                              "Unknown Course"}
                          </div>
                          <div className="text-gray-500">
                            {application.universityDetails?.name ||
                              "Unknown University"}
                          </div>
                          <div className="text-gray-500">
                            {application.destinationDetails?.name ||
                              "Unknown Destination"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBackgroundColor(
                            application.background
                          )}`}
                        >
                          {application.background.charAt(0).toUpperCase() +
                            application.background.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                              application.status
                            )}`}
                          >
                            {getStatusIcon(application.status)}
                            <span className="ml-1">
                              {application.status === "under_review"
                                ? "Under Review"
                                : application.status.charAt(0).toUpperCase() +
                                  application.status.slice(1)}
                            </span>
                          </span>
                          <select
                            value={application.status}
                            onChange={(e) =>
                              handleStatusChange(
                                application._id!,
                                e.target.value
                              )
                            }
                            className="text-xs border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-orange-500"
                          >
                            <option value="pending">Pending</option>
                            <option value="under_review">Under Review</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {application.createdAt
                          ? formatDate(application.createdAt)
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Button
                            onClick={() => handleEdit(application)}
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
                            onClick={() => setDeleteConfirm(application._id!)}
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
              {filteredApplications.length === 0 && (
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
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No applications found
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm
                      ? "Try adjusting your search terms."
                      : "Get started by creating a new application."}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Application Form Modal */}
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
                className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {editingApplication
                        ? "Edit Application"
                        : "Add New Application"}
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
                        User ID *
                      </label>
                      <Input
                        type="text"
                        name="user"
                        value={applicationData.user}
                        onChange={handleChange}
                        required
                        placeholder="Enter user ID"
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
                        value={applicationData.email}
                        onChange={handleChange}
                        required
                        placeholder="Enter email address"
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Course ID *
                      </label>
                      <Input
                        type="text"
                        name="course"
                        value={applicationData.course}
                        onChange={handleChange}
                        required
                        placeholder="Enter course ID"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        University ID *
                      </label>
                      <Input
                        type="text"
                        name="university"
                        value={applicationData.university}
                        onChange={handleChange}
                        required
                        placeholder="Enter university ID"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Destination ID *
                      </label>
                      <Input
                        type="text"
                        name="destination"
                        value={applicationData.destination}
                        onChange={handleChange}
                        required
                        placeholder="Enter destination ID"
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        SSC Result
                      </label>
                      <Input
                        type="text"
                        name="sscResult"
                        value={applicationData.sscResult}
                        onChange={handleChange}
                        placeholder="Enter SSC result"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        HSC Result
                      </label>
                      <Input
                        type="text"
                        name="hscResult"
                        value={applicationData.hscResult}
                        onChange={handleChange}
                        placeholder="Enter HSC result"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        IELTS Result
                      </label>
                      <Input
                        type="text"
                        name="ieltsResult"
                        value={applicationData.ieltsResult}
                        onChange={handleChange}
                        placeholder="Enter IELTS result"
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Student Number *
                      </label>
                      <Input
                        type="text"
                        name="studentNumber"
                        value={applicationData.studentNumber}
                        onChange={handleChange}
                        required
                        placeholder="Enter student number"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Background *
                      </label>
                      <select
                        name="background"
                        value={applicationData.background}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
                      >
                        <option value="">Select Background</option>
                        <option value="science">Science</option>
                        <option value="commerce">Commerce</option>
                        <option value="arts">Arts</option>
                        <option value="engineering">Engineering</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Status *
                      </label>
                      <select
                        name="status"
                        value={applicationData.status}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
                      >
                        <option value="pending">Pending</option>
                        <option value="under_review">Under Review</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Photo
                      </label>
                      <Input
                        type="file"
                        name="photo"
                        onChange={handleChange}
                        accept="image/*"
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Remarks
                    </label>
                    <textarea
                      name="remarks"
                      value={applicationData.remarks || ""}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Enter any remarks or notes"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300 resize-none"
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
                          {editingApplication ? "Updating..." : "Creating..."}
                        </div>
                      ) : editingApplication ? (
                        "Update Application"
                      ) : (
                        "Create Application"
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
                    Delete Application
                  </h3>
                  <p className="text-sm text-gray-500 mb-6">
                    Are you sure you want to delete this application? This
                    action cannot be undone.
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

export default ApplicationPage;
