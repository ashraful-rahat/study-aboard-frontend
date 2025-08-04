"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/utils/axios";

interface Course {
  _id: string;
  name: string;
  universityId: string;
}

interface University {
  _id: string;
  name: string;
  destinationId: string;
}

interface Destination {
  _id: string;
  name: string;
  country: string;
}

const ApplicationPage = () => {
  const router = useRouter();

  const [courses, setCourses] = useState<Course[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    course: "",
    university: "",
    destination: "",
    sscResult: "",
    hscResult: "",
    ieltsResult: "",
    scoreResult: "",
    studentNumber: "",
    email: "",
    background: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = new FormData();

      // Append data field as JSON string
      payload.append("data", JSON.stringify(formData));

      // Append photo file if exists
      if (selectedPhoto) {
        payload.append("photo", selectedPhoto);
      }

      await axiosInstance.post("/applications/create-application", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Application submitted successfully!");
      router.push("/dashboard");
    } catch (err) {
      console.error("Application submission failed:", err);
      alert("Failed to submit. Try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [courseRes, universityRes, destinationRes] = await Promise.all([
          axiosInstance.get("/courses"),
          axiosInstance.get("/universities"),
          axiosInstance.get("/destination"),
        ]);

        setCourses(courseRes.data.data);
        setUniversities(universityRes.data.data);
        setDestinations(destinationRes.data.data);
      } catch (err) {
        console.error("❌ Error loading data:", err);
      }
    };

    fetchAll();
  }, []);

  const getDestinationNameById = (id: string) => {
    const dest = destinations.find((d) => d._id === id);
    return dest ? `(${dest.name})` : "";
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Apply for a Course</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Course */}
        <div>
          <label className="block mb-1 font-medium">Select Course</label>
          <select
            name="course"
            value={formData.course}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          >
            <option value="">-- Select a course --</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>

        {/* University */}
        <div>
          <label className="block mb-1 font-medium">Select University</label>
          <select
            name="university"
            value={formData.university}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          >
            <option value="">-- Select a university --</option>
            {universities.map((uni) => (
              <option key={uni._id} value={uni._id}>
                {uni.name} {getDestinationNameById(uni.destinationId)}
              </option>
            ))}
          </select>
        </div>

        {/* Destination */}
        <div>
          <label className="block mb-1 font-medium">Select Destination</label>
          <select
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          >
            <option value="">-- Select a destination --</option>
            {destinations.map((dest) => (
              <option key={dest._id} value={dest._id}>
                {dest.name}, {dest.country}
              </option>
            ))}
          </select>
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 gap-4">
          <input
            name="sscResult"
            onChange={handleChange}
            value={formData.sscResult}
            placeholder="SSC Result"
            className="border p-2 rounded"
          />
          <input
            name="hscResult"
            onChange={handleChange}
            value={formData.hscResult}
            placeholder="HSC Result"
            className="border p-2 rounded"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input
            name="ieltsResult"
            onChange={handleChange}
            value={formData.ieltsResult}
            placeholder="IELTS Score"
            className="border p-2 rounded"
          />
        </div>

        {/* Other info */}
        <input
          name="studentNumber"
          onChange={handleChange}
          value={formData.studentNumber}
          placeholder="Student Number"
          className="w-full border p-2 rounded"
        />
        <input
          name="email"
          type="email"
          onChange={handleChange}
          value={formData.email}
          placeholder="Email"
          className="w-full border p-2 rounded"
        />

        {/* Background */}
        <div>
          <label className="block mb-1">Background</label>
          <select
            name="background"
            value={formData.background}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          >
            <option value="">-- Select background --</option>
            <option value="science">Science</option>
            <option value="commerce">Commerce</option>
            <option value="arts">Arts</option>
          </select>
        </div>

        {/* File input for photo */}
        <div>
          <label className="block mb-1 font-medium">
            Upload Photo (optional)
          </label>
          <input
            type="file"
            name="photo"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setSelectedPhoto(e.target.files[0]);
              }
            }}
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          {loading ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </div>
  );
};

export default ApplicationPage;
