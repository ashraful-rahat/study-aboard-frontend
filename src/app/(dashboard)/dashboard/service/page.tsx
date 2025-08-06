"use client";
import axiosInstance from "@/utils/axios";
import React, { useState, useEffect, ChangeEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

interface IFAQItem {
  question: string;
  answer: string;
}

interface IService {
  _id?: string;
  title: string;
  slug: string;
  shortDescription: string;
  content: string;

  coverImage?: File | null;
  faq: IFAQItem[];
  createdAt?: string;
  updatedAt?: string;
}

const ServicesPage = () => {
  const [services, setServices] = useState<IService[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<IService | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [serviceData, setServiceData] = useState<IService>({
    title: "",
    slug: "",
    shortDescription: "",
    content: "",

    coverImage: null,
    faq: [{ question: "", answer: "" }],
  });

  // Fetch all services
  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/services");
      setServices(response.data.data || []);
    } catch (error) {
      console.error("Error fetching services:", error);
      alert("Failed to fetch services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index?: number
  ) => {
    const { name, value } = e.target;
    if (e.target instanceof HTMLInputElement && e.target.type === "file") {
      const file = e.target.files ? e.target.files[0] : null;
      setServiceData({ ...serviceData, [name]: file });
    } else if (name === "question" || name === "answer") {
      const newFaq: IFAQItem[] = [...serviceData.faq];
      if (index !== undefined) {
        newFaq[index][name as "question" | "answer"] = value;
        setServiceData({ ...serviceData, faq: newFaq });
      }
    } else {
      setServiceData({ ...serviceData, [name]: value });
    }
  };

  const handleAddFaq = () => {
    setServiceData({
      ...serviceData,
      faq: [...serviceData.faq, { question: "", answer: "" }],
    });
  };

  const handleRemoveFaq = (index: number) => {
    const newFaq = serviceData.faq.filter((_, i) => i !== index);
    setServiceData({ ...serviceData, faq: newFaq });
  };

  const resetForm = () => {
    setServiceData({
      title: "",
      slug: "",
      shortDescription: "",
      content: "",

      coverImage: null,
      faq: [{ question: "", answer: "" }],
    });
    setEditingService(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", serviceData.title);
    formData.append("slug", serviceData.slug);
    formData.append("shortDescription", serviceData.shortDescription);
    formData.append("content", serviceData.content);

    if (serviceData.coverImage) {
      formData.append("coverImage", serviceData.coverImage);
    }

    formData.append("faq", JSON.stringify(serviceData.faq));

    try {
      if (editingService?._id) {
        // Update existing service
        await axiosInstance.patch(`/services/${editingService._id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        alert("Service updated successfully!");
      } else {
        // Create new service
        await axiosInstance.post("/services", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        alert("Service added successfully!");
      }

      fetchServices();
      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service: IService) => {
    setEditingService(service);
    setServiceData({
      title: service.title,
      slug: service.slug,
      shortDescription: service.shortDescription,
      content: service.content,

      coverImage: null,
      faq:
        service.faq.length > 0 ? service.faq : [{ question: "", answer: "" }],
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/services/${id}`);
      alert("Service deleted successfully!");
      fetchServices();
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting service:", error);
      alert("Failed to delete service");
    }
  };

  const filteredServices = services.filter(
    (service) =>
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Services Management
              </h1>
              <p className="text-gray-600 mt-2">
                Manage all your services and offerings
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
              Add New Service
            </Button>
          </div>
        </div>

        {/* Search and Stats */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1 max-w-md">
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
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {services.length}
                </div>
                <div className="text-sm text-gray-600">Total Services</div>
              </div>
            </div>
          </div>
        </div>

        {/* Services Table */}
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
                      Service
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Slug
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      FAQs
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredServices.map((service) => (
                    <motion.tr
                      key={service._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
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
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                              />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {service.title}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {service.slug}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {service.shortDescription}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {service.faq?.length || 0} FAQs
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {service.createdAt
                          ? new Date(service.createdAt).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Button
                            onClick={() => handleEdit(service)}
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
                            onClick={() => setDeleteConfirm(service._id!)}
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
              {filteredServices.length === 0 && (
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
                    No services found
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm
                      ? "Try adjusting your search terms."
                      : "Get started by creating a new service."}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Service Form Modal */}
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
                      {editingService ? "Edit Service" : "Add New Service"}
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
                        Title *
                      </label>
                      <Input
                        type="text"
                        name="title"
                        value={serviceData.title}
                        onChange={handleChange}
                        required
                        placeholder="Enter service title"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Slug *
                      </label>
                      <Input
                        type="text"
                        name="slug"
                        value={serviceData.slug}
                        onChange={handleChange}
                        required
                        placeholder="service-slug"
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Short Description *
                    </label>
                    <textarea
                      name="shortDescription"
                      value={serviceData.shortDescription}
                      onChange={handleChange}
                      required
                      rows={3}
                      placeholder="Brief description of the service"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Content *
                    </label>
                    <textarea
                      name="content"
                      value={serviceData.content}
                      onChange={handleChange}
                      required
                      rows={6}
                      placeholder="Detailed content about the service"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div></div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Cover Image
                      </label>
                      <Input
                        type="file"
                        name="coverImage"
                        onChange={handleChange}
                        accept="image/*"
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        FAQs
                      </h3>
                      <Button
                        type="button"
                        onClick={handleAddFaq}
                        variant="outline"
                        size="sm"
                        className="text-orange-600 border-orange-600 hover:bg-orange-50"
                      >
                        <svg
                          className="w-4 h-4 mr-2"
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
                        Add FAQ
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {serviceData.faq.map((item, index) => (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-gray-700">
                              FAQ {index + 1}
                            </span>
                            {serviceData.faq.length > 1 && (
                              <Button
                                type="button"
                                onClick={() => handleRemoveFaq(index)}
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-800 hover:bg-red-50"
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
                            )}
                          </div>
                          <div className="space-y-3">
                            <Input
                              type="text"
                              name="question"
                              value={item.question}
                              onChange={(e) => handleChange(e, index)}
                              placeholder="Enter question"
                              className="w-full"
                            />
                            <textarea
                              name="answer"
                              value={item.answer}
                              onChange={(e) => handleChange(e, index)}
                              rows={3}
                              placeholder="Enter answer"
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300 resize-none"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
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
                          {editingService ? "Updating..." : "Creating..."}
                        </div>
                      ) : editingService ? (
                        "Update Service"
                      ) : (
                        "Create Service"
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
                    Delete Service
                  </h3>
                  <p className="text-sm text-gray-500 mb-6">
                    Are you sure you want to delete this service? This action
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

export default ServicesPage;
