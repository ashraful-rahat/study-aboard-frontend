"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { applicationService } from "@/utils/applicationService";
import { Application } from "@/types";
import { Button } from "@/components/ui/Button";

interface ApplicationStatusProps {
  userId?: string;
}

const ApplicationStatus: React.FC<ApplicationStatusProps> = ({ userId }) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      fetchApplications();
    }
  }, [userId]);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await applicationService.getUserApplications(userId!);
      setApplications(data);
    } catch (err) {
      console.error("Failed to fetch applications:", err);
      setError("Failed to load applications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "pending":
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return "✅";
      case "rejected":
        return "❌";
      case "pending":
      default:
        return "⏳";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <span className="text-red-800">{error}</span>
        <Button
          onClick={fetchApplications}
          variant="outline"
          size="sm"
          className="ml-2"
        >
          Retry
        </Button>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-lg font-medium">No applications found</p>
          <p className="text-sm">You haven't submitted any applications yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Applications</h3>
      {applications.map((application) => (
        <motion.div
          key={application._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 mb-2">
                Application #{application._id.slice(-6)}
              </h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Course:</strong> {application.course}</p>
                <p><strong>University:</strong> {application.university}</p>
                {application.destination && (
                  <p><strong>Destination:</strong> {application.destination}</p>
                )}
                <p><strong>Submitted:</strong> {new Date(application.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="ml-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(application.status || 'pending')}`}>
                <span className="mr-1">{getStatusIcon(application.status || 'pending')}</span>
                {application.status || 'pending'}
              </span>
            </div>
          </div>
          
          {application.remarks && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Remarks:</strong> {application.remarks}
              </p>
            </div>
          )}
          
          <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
            <span>Last updated: {new Date(application.updatedAt).toLocaleDateString()}</span>
            {application.documents && (
              <a
                href={application.documents}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                View Documents
              </a>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ApplicationStatus; 