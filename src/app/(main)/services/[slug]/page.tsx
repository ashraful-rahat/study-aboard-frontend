/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axios";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";

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

export default function ServiceDetails() {
  const params = useParams();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/services/${params.slug}`);
        if (res.data && res.data.data) {
          setService(res.data.data);
        } else {
          setError("Service not found");
        }
      } catch (err: any) {
        console.error('Error fetching service details:', err);
        setError(err.response?.data?.message || "Failed to load service details");
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchServiceDetails();
    }
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-500 text-center">{error || "Service not found"}</p>
        <Button onClick={() => window.history.back()} variant="outline">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Add your service details UI here */}
    </div>
  );
}
