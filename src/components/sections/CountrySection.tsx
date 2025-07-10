"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

// Define the type for a single country data object
interface Country {
  _id: string;
  name: string;
  flagImage: string; // Path to the country's flag image (e.g., 1.png, 2.png)
  description: string;
}

// Static data for countries - Using your existing flag images from public/images
const staticCountries: Country[] = [
  {
    _id: "usa001",
    name: "United States",
    flagImage: "/images/1.png", // Using your 1.png
    description:
      "Diverse culture, world-class universities, and leading innovation hubs make the USA a top choice for international students. A land of endless opportunities and academic excellence.",
  },
  {
    _id: "uk003",
    name: "United Kingdom",
    flagImage: "/images/2.png", // Using your 2.png
    description:
      "Home to some of the oldest and most prestigious universities in the world, offering rich academic traditions and historic cities.",
  },
  {
    _id: "can002",
    name: "Canada",
    flagImage: "/images/3.png", // Using your 3.png
    description:
      "Known for its welcoming environment, high quality of life, and excellent public education system. A multicultural mosaic offering vibrant student life.",
  },
  {
    _id: "aus004",
    name: "Australia",
    flagImage: "/images/4.png", // Using your 4.png
    description:
      "Offers a relaxed lifestyle, stunning natural landscapes, and a strong focus on research and innovation.",
  },
  {
    _id: "ger005",
    name: "Germany",
    flagImage: "/images/5.png", // Using your 5.png
    description:
      "Renowned for its engineering and science programs, with many universities offering free or low-cost tuition and cutting-edge research.",
  },
  {
    _id: "fr006",
    name: "France",
    flagImage: "/images/6.png", // Using your 6.png
    description:
      "A hub for arts, fashion, and culinary studies, offering a unique cultural experience in beautiful cities.",
  },
  {
    _id: "jp007",
    name: "Japan",
    flagImage: "/images/7.jpg", // Using your 7.jpg (assuming it's a flag, even if .jpg)
    description:
      "Experience cutting-edge technology, rich traditions, and unique academic opportunities in a land of contrasts.",
  },
];

const CountrySection: React.FC = () => {
  const countries: Country[] = staticCountries; // Using static data

  return (
    <section className="py-16 md:py-24 bg-gray-50 text-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-center mb-16 text-gray-900">
          Explore Top <span className="text-blue-600">Study Destinations</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
          {countries.map((country) => (
            <motion.div
              key={country._id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5 }}
              className="group relative bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 cursor-pointer
                         transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2" // Enhanced hover effect
            >
              {/* Top section with Flag Icon and Country Name */}
              <div
                className="relative p-6 md:p-8 pt-10 flex flex-col items-center text-center
                          bg-gradient-to-br from-blue-50 to-indigo-50 border-b border-gray-100"
              >
                {" "}
                {/* Light gradient background */}
                {/* Flag Icon Container */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white shadow-md flex items-center justify-center -mt-10 mb-6 border-4 border-white overflow-hidden">
                  <img
                    src={country.flagImage}
                    alt={`Flag of ${country.name}`}
                    className="w-full h-full object-contain" // Use object-contain to fit the flag without stretching
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://placehold.co/80x80/e0e0e0/333333?text=Flag"; // Fallback if flag fails
                    }}
                  />
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 leading-tight">
                  {country.name}
                </h3>
              </div>

              {/* Card Content (Description and Link) */}
              <div className="p-6 md:p-8">
                <p className="text-gray-700 text-base mb-6 line-clamp-4 leading-relaxed">
                  {country.description}
                </p>
                <Link
                  href={`/destination/${country._id}`}
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200 group-hover:underline group-hover:underline-offset-4"
                >
                  Learn More <span className="ml-1 text-xl">&rarr;</span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CountrySection;
