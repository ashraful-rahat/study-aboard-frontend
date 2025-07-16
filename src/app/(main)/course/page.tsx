"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { GraduationCap, Search } from "lucide-react";
import axiosInstance from "@/utils/axios";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/Button";

interface Course {
  _id: string;
  name: string;
  description: string;
  duration: string;
  tuitionFee: number;
  universityId: string;
  photo: string;
  programType?: string;
  category?: string;
}

const CourseSection = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter States
  const [programTypeFilter, setProgramTypeFilter] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const programTypes = ["Bachelor", "Master", "Diploma"];
  const categories = [
    "Engineering",
    "Law",
    "Biology",
    "Science",
    "Business",
    "Arts",
    "Design",
  ];

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get("/courses");
        setAllCourses(res.data.data);
        setCourses(res.data.data);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
        setError("Failed to load courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    let filtered = [...allCourses];

    if (programTypeFilter) {
      filtered = filtered.filter(
        (course) => course.programType === programTypeFilter
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter(
        (course) => course.category === categoryFilter
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (course) =>
          course.name.toLowerCase().includes(query) ||
          course.description.toLowerCase().includes(query)
      );
    }

    setCourses(filtered);
  }, [programTypeFilter, categoryFilter, searchQuery, allCourses]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100  pt-20 pb-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-md border border-gray-200">
            <GraduationCap className="text-indigo-600 w-6 h-6 animate-bounce" />
            <span className="text-gray-800 font-semibold text-lg">
              Featured Programs
            </span>
            <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200">
              {courses.length} Courses
            </Badge>
          </div>

          <h2 className="text-4xl md:text-5xl font-extrabold mt-6 tracking-tight text-gray-900">
            Explore Popular <span className="text-indigo-600">Courses</span>
          </h2>
          <p className="text-gray-600 text-lg mt-4 max-w-3xl mx-auto">
            Discover undergraduate and postgraduate programs across global
            universities
          </p>
        </motion.div>

        {/* Filter and Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-12 flex flex-col md:flex-row gap-4 items-center justify-between p-6 bg-white rounded-xl shadow-sm border border-gray-200"
        >
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <Select
                value={programTypeFilter}
                onValueChange={(value) => setProgramTypeFilter(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Program Type">
                    {programTypeFilter || "Program Type"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Programs</SelectItem>
                  {programTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Select
                value={categoryFilter}
                onValueChange={(value) => setCategoryFilter(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category">
                    {categoryFilter || "Category"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={() => {
                setSearchQuery("");
                setProgramTypeFilter("");
                setCategoryFilter("");
              }}
              variant="outline"
              className="whitespace-nowrap"
            >
              Clear Filters
            </Button>
          </div>
        </motion.div>

        {error && (
          <div className="text-center text-red-600 font-medium mb-8 p-4 bg-red-50 rounded-lg">
            {error}
          </div>
        )}

        {/* Courses Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {courses.length > 0 ? (
            courses.map((course, index) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={course.photo || "/placeholder-course.jpg"}
                    alt={course.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={index < 3}
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute top-3 right-3 bg-white/90 px-2.5 py-1 rounded-full text-xs font-bold shadow text-indigo-700">
                    {course.duration} Year
                    {parseInt(course.duration) > 1 ? "s" : ""}
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
                      {course.name}
                    </h3>
                    <Badge
                      variant="secondary"
                      className="ml-2 whitespace-nowrap"
                    >
                      {course.programType}
                    </Badge>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {course.description}
                  </p>

                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="text-indigo-600">
                      {course.category}
                    </Badge>
                    <div className="text-right">
                      <span className="text-xs text-gray-500">Tuition</span>
                      <p className="font-bold text-indigo-600">
                        ${course.tuitionFee.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-16 bg-white rounded-lg shadow-sm border border-gray-100"
            >
              <div className="mx-auto max-w-md">
                <Search className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  No courses found
                </h3>
                <p className="mt-2 text-gray-500">
                  Try adjusting your search or filter criteria
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setProgramTypeFilter("");
                    setCategoryFilter("");
                  }}
                  variant="ghost"
                  className="mt-4"
                >
                  Clear all filters
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default CourseSection;
