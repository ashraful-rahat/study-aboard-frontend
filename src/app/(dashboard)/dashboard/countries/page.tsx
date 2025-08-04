"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axios";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  FileText,
  GraduationCap,
  Upload,
  X,
  Globe,
} from "lucide-react";

interface IDestination {
  _id?: string;
  name: string;
  description: string;
  country: string;
  photo?: string;
  bestTimeToVisit?: string;
  visaRequirements?: string;
  studentVisa?: string | null;
}

const CountryPage = () => {
  const [destinations, setDestinations] = useState<IDestination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] =
    useState<IDestination | null>(null);

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/destination");
      setDestinations(res.data.data);
    } catch (error) {
      setError("Failed to fetch destinations");
      console.error("Failed to fetch destinations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  const handleAddDestination = async (formData: FormData) => {
    try {
      await axiosInstance.post("/destination/create-destination", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Destination created successfully!");
      fetchDestinations();
    } catch (error) {
      console.error(error);
      alert("Failed to create destination");
    }
  };

  const handleEditDestination = async (id: string, formData: FormData) => {
    try {
      await axiosInstance.patch(`/destination/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Destination updated successfully!");
      fetchDestinations();
    } catch (error) {
      console.error(error);
      alert("Failed to update destination");
    }
  };

  const handleDeleteDestination = async (id: string) => {
    if (!confirm("Are you sure you want to delete this destination?")) return;

    try {
      await axiosInstance.delete(`/destination/${id}`);
      alert("Destination deleted successfully!");
      fetchDestinations();
    } catch (error) {
      console.error(error);
      alert("Failed to delete destination");
    }
  };

  const handleViewDestination = (destination: IDestination) => {
    setSelectedDestination(destination);
    setIsViewModalOpen(true);
  };

  const handleEditDestinationClick = (destination: IDestination) => {
    setSelectedDestination(destination);
    setIsEditModalOpen(true);
  };

  // Filter destinations based on search term
  const filteredDestinations = destinations.filter(
    (destination) =>
      destination.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      destination.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      destination.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDestinations = filteredDestinations.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredDestinations.length / itemsPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">Error</div>
          <div className="text-gray-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Destinations</h1>
              <p className="text-gray-600 mt-1">
                Manage all study destinations in the system
              </p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Destination
            </button>
          </div>
        </div>

        {/* Search and Stats */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search destinations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>Total: {destinations.length}</span>
              <span>Showing: {currentDestinations.length}</span>
            </div>
          </div>
        </div>

        {/* Destinations Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Destination
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Country
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Best Time to Visit
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Visa Requirements
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student Visa
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentDestinations.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      {searchTerm
                        ? "No destinations found matching your search."
                        : "No destinations found."}
                    </td>
                  </tr>
                ) : (
                  currentDestinations.map((destination) => (
                    <tr
                      key={destination._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {destination.photo && (
                            <img
                              src={destination.photo}
                              alt={destination.name}
                              className="w-12 h-12 rounded-lg object-cover mr-4"
                            />
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {destination.name}
                            </div>
                            <div className="text-sm text-gray-500 line-clamp-2 max-w-xs">
                              {destination.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-gray-900">
                          <Globe className="w-4 h-4 mr-2 text-gray-400" />
                          {destination.country}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-gray-900">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          {destination.bestTimeToVisit || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-gray-900">
                          <FileText className="w-4 h-4 mr-2 text-gray-400" />
                          {destination.visaRequirements || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-gray-900">
                          <GraduationCap className="w-4 h-4 mr-2 text-gray-400" />
                          {destination.studentVisa || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleViewDestination(destination)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleEditDestinationClick(destination)
                            }
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              destination._id &&
                              handleDeleteDestination(destination._id)
                            }
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {indexOfFirstItem + 1} to{" "}
                  {Math.min(indexOfLastItem, filteredDestinations.length)} of{" "}
                  {filteredDestinations.length} results
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-2 text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Destination Modal */}
      <AddDestinationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddDestination}
      />

      {/* Edit Destination Modal */}
      <EditDestinationModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        destination={selectedDestination}
        onSubmit={handleEditDestination}
      />

      {/* View Destination Modal */}
      <ViewDestinationModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        destination={selectedDestination}
      />
    </div>
  );
};

// Add Destination Modal Component
const AddDestinationModal = ({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => Promise<void>;
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    country: "",
    bestTimeToVisit: "",
    visaRequirements: "",
    studentVisa: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(e.target.files?.[0] || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) {
          formToSend.append(key, value);
        }
      });
      if (selectedFile) {
        formToSend.append("photo", selectedFile);
      }

      await onSubmit(formToSend);
      setFormData({
        name: "",
        description: "",
        country: "",
        bestTimeToVisit: "",
        visaRequirements: "",
        studentVisa: "",
      });
      setSelectedFile(null);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            Add New Destination
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destination Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country *
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Best Time to Visit
              </label>
              <input
                type="text"
                name="bestTimeToVisit"
                value={formData.bestTimeToVisit}
                onChange={handleChange}
                placeholder="e.g. September to December"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Visa Requirements
              </label>
              <input
                type="text"
                name="visaRequirements"
                value={formData.visaRequirements}
                onChange={handleChange}
                placeholder="e.g. Tourist visa required"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Student Visa Info
              </label>
              <input
                type="text"
                name="studentVisa"
                value={formData.studentVisa}
                onChange={handleChange}
                placeholder="e.g. Student visa valid for duration of study"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destination Photo
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center px-4 py-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <Upload className="w-5 h-5 mr-2" />
                  Choose File
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                {selectedFile && (
                  <span className="text-sm text-gray-600">
                    {selectedFile.name}
                  </span>
                )}
              </div>
              {selectedFile && (
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Preview"
                  className="mt-3 h-32 rounded-lg object-cover"
                />
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
            >
              {loading ? "Creating..." : "Create Destination"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Edit Destination Modal Component
const EditDestinationModal = ({
  isOpen,
  onClose,
  destination,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  destination: IDestination | null;
  onSubmit: (id: string, data: FormData) => Promise<void>;
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    country: "",
    bestTimeToVisit: "",
    visaRequirements: "",
    studentVisa: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (destination) {
      setFormData({
        name: destination.name,
        description: destination.description,
        country: destination.country,
        bestTimeToVisit: destination.bestTimeToVisit || "",
        visaRequirements: destination.visaRequirements || "",
        studentVisa: destination.studentVisa || "",
      });
    }
  }, [destination]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(e.target.files?.[0] || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination?._id) return;

    setLoading(true);
    try {
      const formToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) {
          formToSend.append(key, value);
        }
      });
      if (selectedFile) {
        formToSend.append("photo", selectedFile);
      }

      await onSubmit(destination._id, formToSend);
      setSelectedFile(null);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !destination) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Edit Destination</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destination Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country *
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Best Time to Visit
              </label>
              <input
                type="text"
                name="bestTimeToVisit"
                value={formData.bestTimeToVisit}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Visa Requirements
              </label>
              <input
                type="text"
                name="visaRequirements"
                value={formData.visaRequirements}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Student Visa Info
              </label>
              <input
                type="text"
                name="studentVisa"
                value={formData.studentVisa}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destination Photo
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center px-4 py-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <Upload className="w-5 h-5 mr-2" />
                  Choose File
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                {selectedFile && (
                  <span className="text-sm text-gray-600">
                    {selectedFile.name}
                  </span>
                )}
              </div>
              {(selectedFile || destination.photo) && (
                <img
                  src={
                    selectedFile
                      ? URL.createObjectURL(selectedFile)
                      : destination.photo
                  }
                  alt="Preview"
                  className="mt-3 h-32 rounded-lg object-cover"
                />
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
            >
              {loading ? "Updating..." : "Update Destination"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// View Destination Modal Component
const ViewDestinationModal = ({
  isOpen,
  onClose,
  destination,
}: {
  isOpen: boolean;
  onClose: () => void;
  destination: IDestination | null;
}) => {
  if (!isOpen || !destination) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            Destination Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {destination.photo && (
            <div className="w-full h-48 rounded-lg overflow-hidden">
              <img
                src={destination.photo}
                alt={destination.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {destination.name}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {destination.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Globe className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Country</p>
                  <p className="font-medium">{destination.country}</p>
                </div>
              </div>

              {destination.bestTimeToVisit && (
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Best Time to Visit</p>
                    <p className="font-medium">{destination.bestTimeToVisit}</p>
                  </div>
                </div>
              )}

              {destination.visaRequirements && (
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Visa Requirements</p>
                    <p className="font-medium">
                      {destination.visaRequirements}
                    </p>
                  </div>
                </div>
              )}

              {destination.studentVisa && (
                <div className="flex items-center space-x-3">
                  <GraduationCap className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Student Visa</p>
                    <p className="font-medium">{destination.studentVisa}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountryPage;
