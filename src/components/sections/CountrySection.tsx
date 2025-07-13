"use client"; // Only if using App Router

import axiosInstance from "@/utils/axios";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MovingBorder } from "@/components/ui/moving-border"; // নিশ্চিত করুন এই পাথটি সঠিক

const CountrySection = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await axiosInstance.get("/destination");
        setDestinations(res.data.data); // Update based on your controller response
      } catch (err) {
        console.error("Failed to load destinations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  if (loading)
    return <p className="text-center text-lg py-10">Loading destinations...</p>;

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-10">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-extrabold text-gray-800 mb-4"
          >
            আমাদের গন্তব্যস্থলসমূহ
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            বিশ্বের সেরা বিশ্ববিদ্যালয়গুলোতে পড়াশোনা করার জন্য আমাদের
            নির্বাচিত গন্তব্যস্থলগুলো ঘুরে দেখুন। আপনার স্বপ্নের দেশ খুঁজে নিন।
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {destinations.map((dest: any) => (
            <MovingBorder
              key={dest._id}
              containerClassName="rounded-xl p-0.5" // বর্ডার কন্টেইনারের জন্য প্যাডিং এবং রাউন্ডেড কর্ণার
              className="flex flex-col h-full items-start justify-start p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.5,
                  delay: 0.1 * destinations.indexOf(dest),
                }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
                }}
                className="w-full"
              >
                <img
                  src={dest.photo}
                  alt={dest.name}
                  className="w-full h-48 object-cover rounded-lg mb-4 transform group-hover:scale-105 transition-transform duration-300"
                />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {dest.name}
                </h2>
                <p className="text-gray-700 text-base leading-relaxed">
                  {dest.description.substring(0, 100)}...{" "}
                  {/* বর্ণনা সংক্ষিপ্ত করা হয়েছে */}
                </p>
                <div className="mt-4 flex flex-wrap gap-2 text-sm text-gray-600">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                    {dest.country}
                  </span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                    Best Time: {dest.bestTimeToVisit.split(" ")[0]}{" "}
                    {/* শুধু প্রথম অংশ দেখানো হয়েছে */}
                  </span>
                </div>
                {/* আরও বিশদ তথ্য বা CTA যোগ করতে পারেন এখানে */}
                <button className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300">
                  আরো জানুন
                </button>
              </motion.div>
            </MovingBorder>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CountrySection;
