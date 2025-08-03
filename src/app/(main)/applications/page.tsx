"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axiosInstance from "@/utils/axios";
import { applicationService } from "@/utils/applicationService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Destination, University, Course, ApplicationInput } from "@/types";
import ApplicationStatus from "@/components/sections/ApplicationStatus";

const Applications = () => {
  const [formData, setFormData] = useState<ApplicationInput>({
    user: "",
    course: "",
    university: "",
    destination: "",
    documents: "",
    photo: "",
    status: "pending",
    remarks: "",
  });

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredUniversities, setFilteredUniversities] = useState<University[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [destinationsRes, universitiesRes, coursesRes] = await Promise.all([
          axiosInstance.get("/destination"),
          axiosInstance.get("/universities"),
          axiosInstance.get("/courses"),
        ]);

        setDestinations(destinationsRes.data.data);
        setUniversities(universitiesRes.data.data);
        setCourses(coursesRes.data.data);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load form data. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter universities based on selected destination
  useEffect(() => {
    if (formData.destination) {
      const filtered = universities.filter(
        (uni) => uni.destinationId === formData.destination
      );
      setFilteredUniversities(filtered);
      // Reset university selection if current selection is not in filtered list
      if (!filtered.find(uni => uni._id === formData.university)) {
        setFormData(prev => ({ ...prev, university: "", course: "" }));
      }
    } else {
      setFilteredUniversities(universities);
    }
  }, [formData.destination, universities]);

  // Filter courses based on selected university
  useEffect(() => {
    if (formData.university) {
      const filtered = courses.filter(
        (course) => course.universityId === formData.university
      );
      setFilteredCourses(filtered);
      // Reset course selection if current selection is not in filtered list
      if (!filtered.find(course => course._id === formData.course)) {
        setFormData(prev => ({ ...prev, course: "" }));
      }
    } else {
      setFilteredCourses([]);
    }
  }, [formData.university, courses]);

  const handleInputChange = (field: keyof ApplicationInput, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleFileUpload = async (file: File, type: 'photo' | 'documents') => {
    try {
      const result = await applicationService.uploadFile(file);
      setFormData(prev => ({ 
        ...prev, 
        [type]: result.secure_url 
      }));
    } catch (err) {
      console.error('File upload failed:', err);
      setError('File upload failed. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.course || !formData.university) {
      setError("Please select both university and course");
      return;
    }

    setSubmitLoading(true);
    setError(null);

    try {
      // Get current user ID from localStorage or context
      const user = localStorage.getItem('userId') || 'current-user-id';
      
      const applicationData = {
        ...formData,
        user,
      };

      await applicationService.createApplication(applicationData);
      
      setSuccess(true);
      setFormData({
        user: "",
        course: "",
        university: "",
        destination: "",
        documents: "",
        photo: "",
        status: "pending",
        remarks: "",
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      console.error("Application submission failed:", err);
      setError(err.response?.data?.message || "Failed to submit application. Please try again.");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-20 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Study Abroad Application
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start your journey to international education. Fill out the form below to apply for your dream course abroad.
          </p>
        </motion.div>

        {/* Success Message */}
        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8 text-center"
          >
            <div className="flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-green-800 font-medium">
                Application submitted successfully! We'll review your application and get back to you soon.
              </span>
            </div>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 text-center"
          >
            <div className="flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-800 font-medium">{error}</span>
            </div>
          </motion.div>
        )}

        {/* Application Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Destination Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Destination Country *
                </label>
                <Select
                  value={formData.destination || ""}
                  onValueChange={(value) => handleInputChange("destination", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue>
                      Select a destination country
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {destinations.map((destination) => (
                      <SelectItem key={destination._id} value={destination._id}>
                        <div className="flex items-center">
                          <span className="mr-2">🌍</span>
                          {destination.name}, {destination.country}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* University Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  University *
                </label>
                <Select
                  value={formData.university || ""}
                  onValueChange={(value) => handleInputChange("university", value)}
                >
                  <SelectTrigger className={`w-full ${!formData.destination ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <SelectValue>
                      {formData.destination ? "Select a university" : "Please select destination first"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {filteredUniversities.map((university) => (
                      <SelectItem key={university._id} value={university._id}>
                        <div className="flex items-center">
                          <span className="mr-2">🏛️</span>
                          {university.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Course Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Course *
                </label>
                <Select
                  value={formData.course || ""}
                  onValueChange={(value) => handleInputChange("course", value)}
                >
                  <SelectTrigger className={`w-full ${!formData.university ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <SelectValue>
                      {formData.university ? "Select a course" : "Please select university first"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {filteredCourses.map((course) => (
                      <SelectItem key={course._id} value={course._id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{course.name}</span>
                          <span className="text-sm text-gray-500">
                            {course.programType} • {course.duration} • ${course.tuitionFee}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Documents Upload */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Documents (PDF, DOC, DOCX)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, 'documents');
                    }}
                    className="hidden"
                    id="documents-upload"
                  />
                  <label htmlFor="documents-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <span className="text-gray-600">
                        {formData.documents ? "Document uploaded ✓" : "Click to upload documents"}
                      </span>
                      <span className="text-sm text-gray-500 mt-1">
                        Upload your academic transcripts, certificates, etc.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Photo Upload */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Profile Photo
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, 'photo');
                    }}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-600">
                        {formData.photo ? "Photo uploaded ✓" : "Click to upload photo"}
                      </span>
                      <span className="text-sm text-gray-500 mt-1">
                        Upload your recent passport-size photo
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Remarks */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Additional Remarks
                </label>
                <textarea
                  value={formData.remarks || ""}
                  onChange={(e) => handleInputChange("remarks", e.target.value)}
                  placeholder="Any additional information you'd like to share..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                />
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button
                  type="submit"
                  disabled={submitLoading || !formData.course || !formData.university}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {submitLoading ? (
                    <div className="flex items-center justify-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                      Submitting Application...
                    </div>
                  ) : (
                    "Submit Application"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Application Status Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Your Application Status
            </h2>
            <ApplicationStatus userId={localStorage.getItem('userId') || undefined} />
          </div>
        </motion.div>

        {/* Information Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Application Process
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Submit Application</h3>
                <p className="text-gray-600 text-sm">
                  Fill out the form above with your details and required documents.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">2</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Review Process</h3>
                <p className="text-gray-600 text-sm">
                  Our team will review your application within 5-7 business days.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">3</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Get Response</h3>
                <p className="text-gray-600 text-sm">
                  You'll receive an email with the status of your application.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Applications;
  