import React from "react";
import { UserCircle, Bell } from "lucide-react";

const DashboardHeader: React.FC = () => {
  return (
    <header className="bg-white p-4 md:p-6 border-b border-gray-200 flex justify-between items-center shadow-sm">
      <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
      <div className="flex items-center gap-4">
        <button className="text-gray-600 hover:text-indigo-600 transition-colors">
          <Bell className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <UserCircle className="w-8 h-8 text-indigo-600" />
          <span className="font-medium text-gray-700">Admin User</span>{" "}
          {/* ইউজার নাম ডাইনামিক হবে */}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
