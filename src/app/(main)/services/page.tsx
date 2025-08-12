"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axios";
import Link from "next/link";

interface FAQ {
  question: string;
  answer: string;
}

interface Service {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  content: string;
  coverImage: string;
  faq: FAQ[];
}

const ServicesPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axiosInstance.get("/services");
        setServices(res.data.data);
      } catch (err) {
        setError("Failed to load services. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-10 text-center">
        Explore Our Services
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => (
          <Link
            key={service._id}
            href={`/services/${service.slug}`}
            className="group bg-white rounded-xl shadow hover:shadow-xl transition-all border"
          >
            <div className="h-52 overflow-hidden rounded-t-xl">
              <img
                src={service.coverImage}
                alt={service.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-5">
              <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition">
                {service.title}
              </h2>
              <p className="text-gray-600 text-sm">
                {service.shortDescription}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ServicesPage;
