// app/(dashboard)/page.tsx
import React from "react";

const DashboardHomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Welcome to Your Dashboard!
      </h2>
      {/* এখানে আপনার ড্যাশবোর্ডের হোমপেজের কন্টেন্ট থাকবে */}
    </div>
  );
};

export default DashboardHomePage;
