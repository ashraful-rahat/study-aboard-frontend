"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axios";
import Image from "next/image";

interface ICourse {
  _id?: string;
  name: string;
  description: string;
  duration: string;
  tuitionFee: number;
  universityId: string; // as string in frontend
  subject?: string;
  photo?: string;
  programType?: "Bachelor" | "Master" | "Diploma";
  category?: string;
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
  data: ICourse;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-full max-w-lg shadow-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Edit Course</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Course Name"
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
            name="duration"
            placeholder="Duration (e.g. 2 Years)"
            value={data.duration}
            onChange={onChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="number"
            name="tuitionFee"
            placeholder="Tuition Fee"
            value={data.tuitionFee}
            onChange={onChange}
            className="w-full border p-2 rounded"
            required
            min={0}
          />
          <input
            type="text"
            name="universityId"
            placeholder="University ID"
            value={data.universityId}
            onChange={onChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="text"
            name="subject"
            placeholder="Subject (optional)"
            value={data.subject || ""}
            onChange={onChange}
            className="w-full border p-2 rounded"
          />
          <select
            name="programType"
            value={data.programType || ""}
            onChange={onChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Program Type</option>
            <option value="Bachelor">Bachelor</option>
            <option value="Master">Master</option>
            <option value="Diploma">Diploma</option>
          </select>
          <input
            type="text"
            name="category"
            placeholder="Category (optional)"
            value={data.category || ""}
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
            // eslint-disable-next-line @next/next/no-img-element
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

const CoursesPage = () => {
  const [formData, setFormData] = useState<ICourse>({
    name: "",
    description: "",
    duration: "",
    tuitionFee: 0,
    universityId: "",
    subject: "",
    photo: "",
    programType: undefined,
    category: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [courses, setCourses] = useState<ICourse[]>([]);

  // Edit modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<ICourse>({
    name: "",
    description: "",
    duration: "",
    tuitionFee: 0,
    universityId: "",
    subject: "",
    photo: "",
    programType: undefined,
    category: "",
  });
  const [editSelectedFile, setEditSelectedFile] = useState<File | null>(null);

  // Fetch all courses
  const fetchCourses = async () => {
    try {
      const res = await axiosInstance.get("/courses");
      setCourses(res.data.data);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      alert("Failed to fetch courses");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Handle create form change
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "tuitionFee") {
      setFormData((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle create file change
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
        if (value !== undefined && value !== null && value !== "") {
          formToSend.append(key, value.toString());
        }
      });

      if (selectedFile) {
        formToSend.append("photo", selectedFile);
      }

      await axiosInstance.post("/courses/create-course", formToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Course created!");
      setFormData({
        name: "",
        description: "",
        duration: "",
        tuitionFee: 0,
        universityId: "",
        subject: "",
        photo: "",
        programType: undefined,
        category: "",
      });
      setSelectedFile(null);
      fetchCourses();
    } catch (error) {
      console.error(error);
      alert("Something went wrong while creating the course.");
    }
  };

  // Open edit modal
  const handleEdit = (course: ICourse) => {
    setEditData(course);
    setEditingId(course._id || null);
    setEditSelectedFile(null);
    setIsEditModalOpen(true);
  };

  // Handle edit form change
  const handleEditChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "tuitionFee") {
      setEditData((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setEditData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle edit file change
  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setEditSelectedFile(file || null);
  };

  // Submit edit form
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
          if (
            key === "universityId" &&
            typeof value === "object" &&
            "_id" in value
          ) {
            formToSend.append(key, value._id);
          } else {
            formToSend.append(key, value.toString());
          }
        }
      });

      if (editSelectedFile) {
        formToSend.append("photo", editSelectedFile);
      }

      for (const pair of formToSend.entries()) {
        console.log(pair[0], pair[1]);
      }

      await axiosInstance.patch(`/courses/${editingId}`, formToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Course updated!");
      setIsEditModalOpen(false);
      setEditingId(null);
      setEditSelectedFile(null);
      fetchCourses();
    } catch (error: any) {
      console.error("Update error response:", error.response?.data);
      if (error.response) {
        alert(
          "Update failed: " + (error.response.data.message || "Unknown error")
        );
      } else {
        alert("Something went wrong while updating.");
      }
    }
  };

  // Delete course
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this course?")) {
      try {
        await axiosInstance.delete(`/courses/${id}`);
        alert("Course deleted!");
        fetchCourses();
      } catch (error) {
        console.error(error);
        alert("Failed to delete.");
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-6">Add Course</h1>

      {/* Create Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 mb-10"
        encType="multipart/form-data"
      >
        <input
          type="text"
          name="name"
          placeholder="Course Name"
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
          name="duration"
          placeholder="Duration (e.g. 2 Years)"
          value={formData.duration}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="number"
          name="tuitionFee"
          placeholder="Tuition Fee"
          value={formData.tuitionFee}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
          min={0}
        />
        <input
          type="text"
          name="universityId"
          placeholder="University ID"
          value={formData.universityId}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="subject"
          placeholder="Subject (optional)"
          value={formData.subject || ""}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <select
          name="programType"
          value={formData.programType || ""}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">Select Program Type</option>
          <option value="Bachelor">Bachelor</option>
          <option value="Master">Master</option>
          <option value="Diploma">Diploma</option>
        </select>
        <input
          type="text"
          name="category"
          placeholder="Category (optional)"
          value={formData.category || ""}
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
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={URL.createObjectURL(selectedFile)}
            alt="Preview"
            className="mt-2 h-32 rounded object-cover"
          />
        )}

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
        <h2 className="text-xl font-semibold mb-4">All Courses</h2>
        <ul className="space-y-3">
          {courses.map((course) => (
            <li
              key={course._id}
              className="border p-4 rounded shadow-sm flex justify-between items-center"
            >
              <div>
                <p className="font-bold">{course.name}</p>
                <p className="text-sm text-gray-600">
                  Duration: {course.duration}
                </p>
                <p className="text-sm text-gray-600">
                  Tuition Fee: ${course.tuitionFee}
                </p>
                <p className="text-sm text-gray-600">
                  University:{" "}
                  {course.universityId &&
                  typeof course.universityId === "object"
                    ? course.universityId.name
                    : course.universityId}
                </p>
                {course.photo && (
                  <Image
                    src={course.photo}
                    alt={course.name}
                    width={150}
                    height={96}
                    className="mt-2 rounded object-cover"
                    style={{ objectFit: "cover" }}
                  />
                )}
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(course)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => course._id && handleDelete(course._id)}
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

export default CoursesPage;
