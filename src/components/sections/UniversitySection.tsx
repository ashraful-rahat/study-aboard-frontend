"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image"; // Import Image component
import Link from "next/link"; // Import Link component
import { MapPin, ExternalLink } from "lucide-react";

import axiosInstance from "@/utils/axios";

interface University {
  _id: string;
  name: string;
  description: string;
  photo: string;
  location: string;
  website: string;
  establishedYear: string;
  destinationId: string;
}

const UniversityShowcase = () => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const res = await axiosInstance.get("/universities");
        // Limit to first 6 universities for homepage
        setUniversities(res.data.data.slice(0, 6));
      } catch (err) {
        console.error("Failed to fetch universities:", err);
        // Fallback data for development if API fails
        setUniversities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUniversities();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-education-light to-background">
        <div className="container mx-auto px-6">
          {/* Adjusted grid for loading skeleton to match display grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-card rounded-xl shadow-card p-6 ">
                <div className="h-40 bg-muted rounded-lg mb-4"></div>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-education-light to-background">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Discover Top <br />
            <span className="bg-gradient-to-r from-orange-500 to-orange-800 bg-clip-text text-transparent">
              Universities
            </span>
          </h2>

          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore world-class institutions and find your perfect academic
            destination
          </p>
        </motion.div>

        {/* Universities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {universities.map((university, index) => (
            <motion.div
              key={university._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{
                y: -8, // Lifts the card up by 8px on hover
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)", // Custom strong shadow
              }}
              className="group bg-card rounded-xl shadow-card transition-all duration-300 overflow-hidden border border-border/50"
            >
              {/* University Image */}
              <div className="relative h-48 overflow-hidden">
                <Image // Using Next.js Image component
                  src={university.photo || "/placeholder.svg"}
                  alt={university.name}
                  fill // Image takes full size of parent div
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" // Optimized sizes for responsive images
                  priority={index < 3} // Prioritize loading for the first few images
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm px-2 py-1 rounded-full">
                  <span className="text-xs font-medium text-foreground">
                    Est. {university.establishedYear}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-education-blue transition-colors">
                  {university.name}
                </h3>

                <div className="flex items-center text-muted-foreground text-sm mb-3">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{university.location}</span>
                </div>

                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {university.description}
                </p>

                {/* Link to external website */}
                <a
                  href={university.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-education-blue hover:text-education-orange font-medium text-sm transition-colors group/link"
                >
                  Visit Website
                  <ExternalLink className="w-4 h-4 ml-1 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          {/* Updated Link to /universities page using Next.js Link */}
          <Link
            href="/register"
            className="block mx-4 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-center font-semibold rounded-full transition-all duration-200 shadow-lg"
          >
            Register Now
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default UniversityShowcase;
