"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axios";
import Image from "next/image";
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

// Modal Component for Editing
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
  data: IDestination;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-full max-w-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Edit Destination</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Destination Name"
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
            name="country"
            placeholder="Country"
            value={data.country}
            onChange={onChange}
            className="w-full border p-2 rounded"
            required
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
          <input
            type="text"
            name="bestTimeToVisit"
            placeholder="Best Time to Visit"
            value={data.bestTimeToVisit || ""}
            onChange={onChange}
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            name="visaRequirements"
            placeholder="Visa Requirements"
            value={data.visaRequirements || ""}
            onChange={onChange}
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            name="studentVisa"
            placeholder="Student Visa Info"
            value={data.studentVisa || ""}
            onChange={onChange}
            className="w-full border p-2 rounded"
          />

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

const CountryPage = () => {
  // Create Form State
  const [formData, setFormData] = useState<IDestination>({
    name: "",
    description: "",
    country: "",
    photo: "",
    bestTimeToVisit: "",
    visaRequirements: "",
    studentVisa: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Destinations list state
  const [destinations, setDestinations] = useState<IDestination[]>([]);

  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<IDestination>({
    name: "",
    description: "",
    country: "",
    photo: "",
    bestTimeToVisit: "",
    visaRequirements: "",
    studentVisa: "",
  });
  const [editSelectedFile, setEditSelectedFile] = useState<File | null>(null);

  // Fetch all destinations from backend
  const fetchDestinations = async () => {
    try {
      const res = await axiosInstance.get("/destination");
      setDestinations(res.data.data);
    } catch (error) {
      console.error("Failed to fetch destinations:", error);
      alert("Failed to fetch destinations");
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  // Handle change for create form inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input for create form
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedFile(file || null);
  };

  // Submit create form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formToSend = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value) formToSend.append(key, value);
      });

      if (selectedFile) {
        formToSend.append("photo", selectedFile);
      }

      await axiosInstance.post("/destination/create-destination", formToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Destination created!");
      setFormData({
        name: "",
        description: "",
        country: "",
        photo: "",
        bestTimeToVisit: "",
        visaRequirements: "",
        studentVisa: "",
      });
      setSelectedFile(null);
      fetchDestinations();
    } catch (error) {
      console.error(error);
      alert("Something went wrong while creating.");
    }
  };

  // Open edit modal and load data
  const handleEdit = (dest: IDestination) => {
    setEditData(dest);
    setEditingId(dest._id || null);
    setEditSelectedFile(null);
    setIsEditModalOpen(true);
  };

  // Edit modal input change handler
  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  // Edit modal file input change handler
  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setEditSelectedFile(file || null);
  };

  // Submit edit modal form
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingId) return;

    try {
      const formToSend = new FormData();

      // Append all editable fields
      Object.entries(editData).forEach(([key, value]) => {
        if (key !== "_id" && value) formToSend.append(key, value);
      });

      // Append new photo if selected
      if (editSelectedFile) {
        formToSend.append("photo", editSelectedFile);
      }

      await axiosInstance.patch(`/destination/${editingId}`, formToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Destination updated!");
      setIsEditModalOpen(false);
      setEditingId(null);
      setEditSelectedFile(null);
      fetchDestinations();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response) {
        alert(
          "Update failed: " + (error.response.data.message || "Unknown error")
        );
      } else {
        alert("Something went wrong while updating.");
      }
      console.error(error);
    }
  };

  // Delete destination
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this destination?")) {
      try {
        await axiosInstance.delete(`/destination/${id}`);
        alert("Destination deleted!");
        fetchDestinations();
      } catch (error) {
        console.error(error);
        alert("Failed to delete.");
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-6">Add Destination</h1>

      {/* Create Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 mb-10"
        encType="multipart/form-data"
      >
        <input
          type="text"
          name="name"
          placeholder="Destination Name"
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
          name="country"
          placeholder="Country"
          value={formData.country}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="file"
          name="photo"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full border p-2 rounded"
        />
        {selectedFile && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={URL.createObjectURL(selectedFile)}
            alt="Preview"
            className="mt-2 h-32 rounded object-cover"
          />
        )}
        <input
          type="text"
          name="bestTimeToVisit"
          placeholder="Best Time to Visit"
          value={formData.bestTimeToVisit}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="visaRequirements"
          placeholder="Visa Requirements"
          value={formData.visaRequirements}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="studentVisa"
          placeholder="Student Visa Info"
          value={formData.studentVisa || ""}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>

      {/* Edit Modal */}
      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        data={editData}
        onChange={handleEditChange}
        onFileChange={handleEditFileChange}
        onSubmit={handleEditSubmit}
      />

      <div>
        <h2 className="text-xl font-semibold mb-4">All Destinations</h2>
        <ul className="space-y-3">
          {destinations.map((dest) => (
            <li
              key={dest._id}
              className="border p-4 rounded shadow-sm flex justify-between items-center"
            >
              <div>
                <p className="font-bold">{dest.name}</p>
                <p className="text-sm text-gray-600">{dest.country}</p>

                {dest.photo && (
                  <Image
                    src={dest.photo}
                    alt={dest.name}
                    width={150} // width অবশ্যই দিতে হবে
                    height={96} // height অবশ্যই দিতে হবে (aspect ratio অনুসারে)
                    className="mt-2 rounded object-cover"
                    style={{ objectFit: "cover" }}
                  />
                )}
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(dest)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(dest._id!)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CountryPage;
