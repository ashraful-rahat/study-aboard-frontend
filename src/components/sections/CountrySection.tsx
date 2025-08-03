// src/components/sections/CountrySection.tsx
"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import axiosInstance from "@/utils/axios";

interface Destination {
  _id: string;
  name: string; // The country name, e.g., "Australia"
  photo: string; // URL to the country image
}

const CountrySection: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const [duplicateDestinations, setDuplicateDestinations] = useState<
    Destination[]
  >([]);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await axiosInstance.get("/destination");
        setDestinations(res.data.data);
      } catch (err) {
        console.error("Failed to load destinations:", err);
        setError("Failed to load destinations. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  useEffect(() => {
    // মারquee ইফেক্টের জন্য ডেটা ডুপ্লিকেট করুন
    // পর্যাপ্ত ডেটা নিশ্চিত করতে অন্তত ২-৩ বার ডুপ্লিকেট করা যেতে পারে,
    // যাতে মারকুই মসৃণভাবে লুপ করে।
    if (destinations.length > 0) {
      setDuplicateDestinations([
        ...destinations,
        ...destinations,
        ...destinations,
      ]);
    }
  }, [destinations]);

  // Loading state
  if (loading) {
    return (
      <section className=" py-12 bg-gray-100 flex justify-center items-center min-h-[300px]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-blue-600 rounded-full animate-pulse"></div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-12 bg-gray-100 flex justify-center items-center min-h-[300px]">
        <div className="text-center p-8 bg-red-50 rounded-2xl border border-red-200">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠</span>
          </div>
          <p className="text-xl text-red-700 font-semibold">{error}</p>
        </div>
      </section>
    );
  }

  // If no destinations are found
  if (destinations.length === 0) {
    return (
      <section className="py-12 bg-gray-100 flex justify-center items-center min-h-[300px]">
        <div className="text-center p-8 bg-blue-50 rounded-2xl border border-blue-200">
          <p className="text-xl text-blue-700 font-semibold">
            No destinations found.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className=" max-w-7xl mx-auto py-12 bg-white overflow-hidden">
      <div className="text-center mb-10">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
          Gain Access to{" "}
          <span className="bg-gradient-to-r from-orange-600 to-purple-900 bg-clip-text text-transparent">
            Top Institutions
          </span>{" "}
          across the Globe
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-4">
          PFEC Global is a partner of renowned institutions across 11 countries.
          Pick a destination below and learn everything you need to make an
          informed decision.
        </p>
      </div>

      <div className="relative w-full overflow-hidden py-4">
        <motion.div
          className="flex flex-nowrap will-change-transform"
          ref={marqueeRef}
          animate={{
            x: ["0%", "-100%"], // 0% থেকে -100% পর্যন্ত translateX, একবার লুপ করার জন্য
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: destinations.length * 2, // ডেটার উপর ভিত্তি করে গতি নির্ধারণ করুন
              ease: "linear",
            },
          }}
        >
          {/* Marquee effect: Duplicate destinations to ensure continuous scroll */}
          {duplicateDestinations.map((dest, index) => (
            <Link
              href={`/country/${dest._id}`}
              key={`${dest._id}-${index}`} // Key should be unique
              className="group flex-shrink-0 w-[280px] h-[350px] mx-4 relative rounded-2xl overflow-hidden shadow-xl
                         transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-300/30
                         border border-gray-200 bg-white"
            >
              <div className="absolute inset-0 z-0">
                <Image
                  src={dest.photo}
                  alt={dest.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 280px"
                  priority={index < 5} // Initial few images can be priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
              </div>

              <div className="relative z-10 flex flex-col justify-end p-6 h-full">
                <div className="flex items-center text-white text-sm font-semibold mb-2">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>Study in {dest.name}</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Learn More
                </h3>
                <span className="inline-flex items-center text-white/90 text-sm font-medium">
                  Discover Programs{" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-4 h-4 ml-1 transform transition-transform duration-300 group-hover:translate-x-1"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                    />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </motion.div>
      </div>

      <div className="flex justify-center mt-10">
        <Link
          href="/country"
          className="inline-flex items-center px-8 py-4 rounded-full text-lg font-semibold
                     bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-900 hover:to-red-600 text-white not-first:transition-all duration-300 transform hover:scale-105"
        >
          View All Destinations
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-5 h-5 ml-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
            />
          </svg>
        </Link>
      </div>
    </section>
  );
};

export default CountrySection;
