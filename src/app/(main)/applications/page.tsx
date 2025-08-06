"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/utils/axios";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";

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

      // Use the authenticated axios instance for application submission
      // since the backend requires authentication
      const authenticatedAxios = axiosInstance;

      // Try different endpoints for application submission
      const endpoints = [
        "/applications/create-application", // Requires auth
        "/applications", // Generic create
        "/applications/submit", // Submit action
        "/public/applications", // Public endpoint
      ];

      let success = false;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let lastError: any = null;

      for (const endpoint of endpoints) {
        try {
          await authenticatedAxios.post(endpoint, payload, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          success = true;
          console.log(`✅ Application submitted successfully via ${endpoint}`);
          break;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          lastError = error;
          console.log(
            `❌ Failed to submit via ${endpoint}: ${error.response?.status}`
          );
          continue;
        }
      }

      if (success) {
        alert("Application submitted successfully!");
        router.push("/");
      } else {
        throw lastError;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Application submission failed:", err);

      // Provide more specific error messages
      if (err.response?.status === 401) {
        alert(
          "Authentication required. Please log in to submit your application. If you don't have an account, please register first."
        );
      } else if (err.response?.status === 404) {
        alert("Application endpoint not found. Please contact support.");
      } else if (err.response?.status === 400) {
        alert("Invalid data. Please check your information and try again.");
      } else if (err.response?.status === 500) {
        alert("Server error. Please try again later.");
      } else {
        alert(
          `Failed to submit application: ${
            err.response?.data?.message || err.message
          }`
        );
      }
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
    testApplicationEndpoints();
  }, []);

  // Test function to check available application endpoints
  const testApplicationEndpoints = async () => {
    const endpoints = [
      "/applications/create-application",
      "/applications",
      "/applications/submit",
      "/public/applications",
    ];

    console.log("Testing available application endpoints...");

    for (const endpoint of endpoints) {
      try {
        const response = await axiosInstance.get(endpoint);
        console.log(`✅ ${endpoint} - Status: ${response.status}`);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.log(
          `❌ ${endpoint} - Status: ${error.response?.status || "No response"}`
        );
      }
    }
  };

  const getDestinationNameById = (id: string) => {
    const dest = destinations.find((d) => d._id === id);
    return dest ? `(${dest.name})` : "";
  };

  return (
    <div className="min-h-screen mt-15 bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-6">
            <svg
              className="w-8 h-8 text-white"
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
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Study Abroad Application
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Complete your application to study abroad. Fill in your details and
            academic information below.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <h2 className="text-2xl font-semibold text-white flex items-center">
              <svg
                className="w-6 h-6 mr-3"
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
              Personal Information
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Course Selection Section */}
            <div className="space-y-6">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Course & Institution Details
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Course */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                    Select Course
                  </label>
                  <select
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white"
                  >
                    <option value="">Choose a course</option>
                    {courses.map((course) => (
                      <option key={course._id} value={course._id}>
                        {course.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* University */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    Select University
                  </label>
                  <select
                    name="university"
                    value={formData.university}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white"
                  >
                    <option value="">Choose a university</option>
                    {universities.map((uni) => (
                      <option key={uni._id} value={uni._id}>
                        {uni.name} {getDestinationNameById(uni.destinationId)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Destination */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Select Destination
                  </label>
                  <select
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white"
                  >
                    <option value="">Choose a destination</option>
                    {destinations.map((dest) => (
                      <option key={dest._id} value={dest._id}>
                        {dest.name}, {dest.country}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Academic Results Section */}
            <div className="space-y-6">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <svg
                    className="w-4 h-4 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Academic Results
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    SSC Result
                  </label>
                  <Input
                    name="sscResult"
                    onChange={handleChange}
                    value={formData.sscResult}
                    placeholder="Enter SSC GPA/CGPA"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    HSC Result
                  </label>
                  <Input
                    name="hscResult"
                    onChange={handleChange}
                    value={formData.hscResult}
                    placeholder="Enter HSC GPA/CGPA"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    IELTS Score
                  </label>
                  <Input
                    name="ieltsResult"
                    onChange={handleChange}
                    value={formData.ieltsResult}
                    placeholder="Enter IELTS score"
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Personal Information Section */}
            <div className="space-y-6">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                  <svg
                    className="w-4 h-4 text-purple-600"
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
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Personal Information
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Student Number
                  </label>
                  <Input
                    name="studentNumber"
                    onChange={handleChange}
                    value={formData.studentNumber}
                    placeholder="Enter your student number"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <Input
                    name="email"
                    type="email"
                    onChange={handleChange}
                    value={formData.email}
                    placeholder="Enter your email address"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Educational Background
                </label>
                <select
                  name="background"
                  value={formData.background}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white"
                >
                  <option value="">Select your background</option>
                  <option value="science">Science</option>
                  <option value="commerce">Commerce</option>
                  <option value="arts">Arts</option>
                </select>
              </div>
            </div>

            {/* Photo Upload Section */}
            <div className="space-y-6">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                  <svg
                    className="w-4 h-4 text-orange-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Photo Upload
                </h3>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Profile Photo (Optional)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition-colors duration-200">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="photo-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="photo-upload"
                          name="photo"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setSelectedPhoto(e.target.files[0]);
                            }
                          }}
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
                {selectedPhoto && (
                  <div className="mt-2 flex items-center text-sm text-green-600">
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {selectedPhoto.name} selected
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-lg text-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
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
                    Submitting Application...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
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
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                    Submit Application
                  </div>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            By submitting this application, you agree to our terms and
            conditions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApplicationPage;
