"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { GraduationCap, Search, Filter } from "lucide-react";
import axiosInstance from "@/utils/axios";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [programTypeFilter, setProgramTypeFilter] = useState<string>("All");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const programTypes = ["All", "Bachelor", "Master", "Diploma"];
  const categories = [
    "All",
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
        setCourses(res.data.data);
        setAllCourses(res.data.data);
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
    if (allCourses.length > 0) {
      let filtered = [...allCourses];

      // Apply program type filter
      if (programTypeFilter && programTypeFilter !== "All") {
        filtered = filtered.filter(
          (course) => course.programType === programTypeFilter
        );
      }

      // Apply category filter
      if (categoryFilter && categoryFilter !== "All") {
        filtered = filtered.filter(
          (course) => course.category === categoryFilter
        );
      }

      // Apply search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (course) =>
            course.name.toLowerCase().includes(query) ||
            course.description.toLowerCase().includes(query)
        );
      }

      setCourses(filtered);
    }
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
    <section className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 pt-20 pb-16">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-md border">
            <GraduationCap className="text-indigo-600 w-6 h-6 animate-bounce" />
            <span className="text-gray-800 font-semibold text-lg">
              Featured Programs
            </span>
            <Badge className="bg-indigo-100 text-indigo-800">
              {courses.length} Courses
            </Badge>
          </div>

          <h2 className="text-4xl md:text-6xl font-extrabold mt-6 tracking-tight text-gray-900">
            Explore Popular <span className="text-indigo-600">Courses</span>
          </h2>
          <p className="text-gray-600 text-lg mt-4 max-w-3xl mx-auto">
            Discover undergraduate and postgraduate programs across global
            universities
          </p>
        </motion.div>

        {/* Filter and Search Section - Fixed Version */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-12 flex flex-col md:flex-row gap-4 items-center justify-center p-6 bg-white rounded-xl shadow-inner border border-gray-100"
        >
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search by course name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full"
            />
          </div>

          <div className="flex gap-4 w-full md:w-2/3 justify-center md:justify-end">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <Select
                value={programTypeFilter}
                onValueChange={(value) => setProgramTypeFilter(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Program Type">
                    {programTypeFilter === "All"
                      ? "Program Type"
                      : programTypeFilter}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {programTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <Select
                value={categoryFilter}
                onValueChange={(value) => setCategoryFilter(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category">
                    {categoryFilter === "All" ? "Category" : categoryFilter}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
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
                setProgramTypeFilter("All");
                setCategoryFilter("All");
              }}
              variant="outline"
              className="px-4 py-2"
            >
              Reset Filters
            </Button>
          </div>
        </motion.div>

        {error && (
          <div className="text-center text-red-600 font-semibold mb-8">
            <p>{error}</p>
          </div>
        )}

        {/* Courses Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {courses.length > 0 ? (
            courses.map((course, index) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border hover:shadow-2xl transition-all duration-300 transform"
              >
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={course.photo || "/placeholder.svg"}
                    alt={course.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    priority={index < 3}
                  />
                  <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-xs font-bold shadow text-indigo-700">
                    {course.duration} Year
                    {parseInt(course.duration) > 1 ? "s" : ""}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {course.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {course.description}
                  </p>
                  <div className="text-sm text-indigo-600 font-medium flex justify-between items-center">
                    <span>Tuition:</span>
                    <span className="font-bold text-base">
                      ${course.tuitionFee.toLocaleString()}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center col-span-full py-12 bg-white rounded-lg shadow-md"
            >
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No courses found matching your criteria.
              </h3>
              <p className="text-gray-500">
                Try adjusting your filters or search query.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default CourseSection;
