/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axios";
import Image from "next/image";
interface Destination {
  _id: string;
  name: string;
  country: string;
  photo?: string;
}

interface FormState {
  name: string;
  description: string;
  country: string;
  photoFile: File | null;
  bestTimeToVisit?: string;
  visaRequirements?: string;
  studentVisa?: string;
}

export default function DestinationDashboard() {
  const [form, setForm] = useState<FormState>({
    name: "",
    description: "",
    country: "",
    photoFile: null,
    bestTimeToVisit: "",
    visaRequirements: "",
    studentVisa: "",
  });

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const fetchDestinations = async () => {
    try {
      const res = await axiosInstance.get("/destination");
      setDestinations(res.data.data || []);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      console.error("Failed to fetch destinations");
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setForm((prev) => ({ ...prev, photoFile: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("country", form.country);
      if (form.photoFile) formData.append("photo", form.photoFile);
      if (form.bestTimeToVisit)
        formData.append("bestTimeToVisit", form.bestTimeToVisit);
      if (form.visaRequirements)
        formData.append("visaRequirements", form.visaRequirements);
      if (form.studentVisa) formData.append("studentVisa", form.studentVisa);

      await axiosInstance.post("/destination/create-destination", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess(true);
      setShowModal(false);
      setForm({
        name: "",
        description: "",
        country: "",
        photoFile: null,
        bestTimeToVisit: "",
        visaRequirements: "",
        studentVisa: "",
      });
      fetchDestinations();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to submit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Destinations</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Destination
        </button>
      </div>

      {/* Destination Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {destinations.map((d) => (
          <div
            key={d._id}
            className="bg-white shadow-md rounded-xl overflow-hidden border hover:shadow-lg transition duration-300"
          >
            {d.photo && (
              <div className="relative w-full h-48">
                <Image
                  src={d.photo}
                  alt={d.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                />
              </div>
            )}
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800">{d.name}</h2>
              <p className="text-sm text-gray-500">{d.country}</p>
            </div>
          </div>
        ))}

        {destinations.length === 0 && (
          <p className="text-gray-600 col-span-full text-center text-lg">
            No destinations added yet.
          </p>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-xl"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">Add New Destination</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
              <textarea
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="country"
                placeholder="Country"
                value={form.country}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="bestTimeToVisit"
                placeholder="Best Time to Visit"
                value={form.bestTimeToVisit}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="visaRequirements"
                placeholder="Visa Requirements"
                value={form.visaRequirements}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="studentVisa"
                placeholder="Student Visa"
                value={form.studentVisa}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              {error && <p className="text-red-600">{error}</p>}
              {success && (
                <p className="text-green-600">
                  Destination added successfully!
                </p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                {loading ? "Saving..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
