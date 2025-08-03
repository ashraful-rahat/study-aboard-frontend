"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axios";

interface IUniversity {
  _id?: string;
  name: string;
  description: string;
  location: string;
  destinationId: string;
  establishedYear?: number;
  website?: string;
  photo?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

const EditModal = ({
  isOpen,
  onClose,
  data,
  onChange,
  onFileChange,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  data: IUniversity;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded w-full max-w-lg shadow-lg overflow-auto max-h-[90vh]">
        <h2 className="text-xl font-semibold mb-4">Edit University</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="University Name"
            value={data.name}
            onChange={onChange}
            className="w-full border p-2 rounded"
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={data.description}
            onChange={onChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={data.location}
            onChange={onChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="text"
            name="destinationId"
            placeholder="Destination ID"
            value={data.destinationId}
            onChange={onChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="number"
            name="establishedYear"
            placeholder="Established Year"
            value={data.establishedYear || ""}
            onChange={onChange}
            className="w-full border p-2 rounded"
            min={1800}
            max={new Date().getFullYear()}
          />
          <input
            type="url"
            name="website"
            placeholder="Website URL"
            value={data.website || ""}
            onChange={onChange}
            className="w-full border p-2 rounded"
          />
          <input
            type="file"
            name="photo"
            accept="image/*"
            onChange={onFileChange}
            className="w-full border p-2 rounded"
          />
          {data.photo && (
            <img
              src={data.photo}
              alt="Preview"
              className="mt-2 h-32 rounded object-cover"
            />
          )}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-400 text-white rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const UniversityPage = () => {
  const [formData, setFormData] = useState<IUniversity>({
    name: "",
    description: "",
    location: "",
    destinationId: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [universities, setUniversities] = useState<IUniversity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<IUniversity>({
    name: "",
    description: "",
    location: "",
    destinationId: "",
  });
  const [editSelectedFile, setEditSelectedFile] = useState<File | null>(null);

  const fetchUniversities = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/universities");
      setUniversities(res.data.data);
    } catch (error) {
      setError("Failed to fetch universities");
      console.error("Failed to fetch universities:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUniversities();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "establishedYear"
          ? value
            ? Number(value)
            : undefined
          : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(e.target.files?.[0] || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formToSend = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          formToSend.append(key, value.toString());
        }
      });

      if (selectedFile) formToSend.append("photo", selectedFile);

      await axiosInstance.post("/universities/create-university", formToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("University created successfully!");
      setFormData({
        name: "",
        description: "",
        location: "",
        destinationId: "",
      });
      setSelectedFile(null);
      fetchUniversities();
    } catch (error) {
      console.error(error);
      alert("Failed to create university");
    }
  };

  const handleEdit = (uni: IUniversity) => {
    setEditData(uni);
    setEditingId(uni._id || null);
    setIsEditModalOpen(true);
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]:
        name === "establishedYear"
          ? value
            ? Number(value)
            : undefined
          : value,
    }));
  };

  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditSelectedFile(e.target.files?.[0] || null);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;

    try {
      const formToSend = new FormData();

      Object.entries(editData).forEach(([key, value]) => {
        if (
          key !== "_id" &&
          value !== undefined &&
          value !== null &&
          value !== ""
        ) {
          formToSend.append(key, value.toString());
        }
      });

      if (editSelectedFile) formToSend.append("photo", editSelectedFile);

      await axiosInstance.patch(`/universities/${editingId}`, formToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("University updated successfully!");
      setIsEditModalOpen(false);
      fetchUniversities();
    } catch (error) {
      console.error(error);
      alert("Failed to update university");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this university?")) return;

    try {
      await axiosInstance.delete(`/universities/${id}`);
      alert("University deleted successfully!");
      fetchUniversities();
    } catch (error) {
      console.error(error);
      alert("Failed to delete university");
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-6">University Management</h1>

      {/* Create Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-10">
        <input
          type="text"
          name="name"
          placeholder="University Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="destinationId"
          placeholder="Destination ID"
          value={formData.destinationId}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="number"
          name="establishedYear"
          placeholder="Established Year"
          value={formData.establishedYear || ""}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          min={1800}
        />
        <input
          type="url"
          name="website"
          placeholder="Website URL"
          value={formData.website || ""}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="file"
          name="photo"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full border p-2 rounded"
        />
        {selectedFile && (
          <img
            src={URL.createObjectURL(selectedFile)}
            alt="Preview"
            className="mt-2 h-32 rounded object-cover"
          />
        )}
        <button
          type="submit"
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Create University
        </button>
      </form>

      {/* Universities List */}
      <h2 className="text-xl font-semibold mb-4">Universities</h2>
      {universities.length === 0 ? (
        <p>No universities found</p>
      ) : (
        <div className="space-y-4">
          {universities.map((uni) => (
            <div key={uni._id} className="border p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{uni.name}</h3>
                  <p className="text-gray-600">{uni.description}</p>
                  <div className="mt-2 space-y-1">
                    <p>
                      <span className="font-semibold">Location:</span>{" "}
                      {uni.location}
                    </p>
                    <p>
                      <span className="font-semibold">Established:</span>{" "}
                      {uni.establishedYear || "N/A"}
                    </p>
                    {uni.website && (
                      <p>
                        <span className="font-semibold">Website:</span>{" "}
                        <a
                          href={uni.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600"
                        >
                          {uni.website}
                        </a>
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(uni)}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => uni._id && handleDelete(uni._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {uni.photo && (
                <img
                  src={uni.photo}
                  alt={uni.name}
                  className="mt-3 w-full max-w-xs rounded-lg"
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        data={editData}
        onChange={handleEditChange}
        onFileChange={handleEditFileChange}
        onSubmit={handleEditSubmit}
      />
    </div>
  );
};

export default UniversityPage;
