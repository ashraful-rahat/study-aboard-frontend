"use client";
import React, { useState, useEffect } from "react";

// Placeholder for Card components (replace with actual shadcn/ui Card components)
// টাইপ সংজ্ঞায়িত করা হলো
interface CardProps {
  children: React.ReactNode;
  className?: string;
}
const Card: React.FC<CardProps> = ({ children, className }) => (
  <div className={`rounded-lg shadow-sm p-4 ${className || ""}`}>
    {children}
  </div>
);

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}
const CardContent: React.FC<CardContentProps> = ({ children, className }) => (
  <div className={className || ""}>{children}</div>
);

interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}
const CardDescription: React.FC<CardDescriptionProps> = ({
  children,
  className,
}) => <p className={`text-sm text-gray-500 ${className || ""}`}>{children}</p>;

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}
const CardHeader: React.FC<CardHeaderProps> = ({ children, className }) => (
  <div className={className || ""}>{children}</div>
);

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}
const CardTitle: React.FC<CardTitleProps> = ({ children, className }) => (
  <h2 className={`text-lg font-semibold ${className || ""}`}>{children}</h2>
);

// Placeholder for Badge (replace with actual shadcn/ui Badge component)
interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "outline" | "secondary" | "destructive" | "default"; // যদি variants ব্যবহার করেন
}
const Badge: React.FC<BadgeProps> = ({ children, className, variant }) => {
  const baseClasses = `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium`;
  let variantClasses = "";
  // আপনি যদি Badge এ variant prop ব্যবহার করেন, তার জন্য ক্লাস যুক্ত করুন
  if (variant === "outline")
    variantClasses = "border border-gray-300 text-gray-700 bg-white";
  else if (variant === "secondary")
    variantClasses = "bg-gray-200 text-gray-800";
  else if (variant === "destructive") variantClasses = "bg-red-500 text-white";
  else variantClasses = "bg-blue-500 text-white"; // default

  return (
    <span className={`${baseClasses} ${variantClasses} ${className || ""}`}>
      {children}
    </span>
  );
};

// Placeholder for Button (replace with actual shadcn/ui Button component)
interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: "outline" | "default";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
}
const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant,
  size,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-md font-medium ${
      variant === "outline"
        ? "border border-gray-300 text-gray-700 bg-white"
        : "bg-blue-600 text-white hover:bg-blue-700"
    } ${size === "sm" ? "text-sm" : ""} ${className || ""}`}
  >
    {children}
  </button>
);

// Placeholder for Input (replace with actual shadcn/ui Input component)
interface InputProps {
  placeholder?: string;
  className?: string;
  type?: string;
}
const Input: React.FC<InputProps> = ({
  placeholder,
  className,
  type = "text",
}) => (
  <input
    type={type}
    placeholder={placeholder}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      className || ""
    }`}
  />
);

// Lucide-react icons (assuming they are installed and available)
import {
  FileText,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
} from "lucide-react";

// Define the Application data model
interface Application {
  id: string;
  studentName: string;
  course: string;
  university: string;
  status: "pending" | "approved" | "rejected";
  submittedDate: string;
  documents: "Complete" | "Incomplete";
}

// Mock data for applications (since Firebase initialization is removed)
const mockApplications: Application[] = [
  {
    id: "app001",
    studentName: "Alice Johnson",
    course: "Computer Science",
    university: "State University",
    status: "pending",
    submittedDate: "2025-07-10",
    documents: "Complete",
  },
  {
    id: "app002",
    studentName: "Bob Williams",
    course: "Business Administration",
    university: "City College",
    status: "approved",
    submittedDate: "2025-07-08",
    documents: "Complete",
  },
  {
    id: "app003",
    studentName: "Charlie Brown",
    course: "Mechanical Engineering",
    university: "Tech Institute",
    status: "rejected",
    submittedDate: "2025-07-05",
    documents: "Incomplete",
  },
  {
    id: "app004",
    studentName: "Diana Prince",
    course: "Fine Arts",
    university: "Art Academy",
    status: "pending",
    submittedDate: "2025-07-01",
    documents: "Complete",
  },
];

// Helper functions for status icons and colors
const getStatusIcon = (status: Application["status"]) => {
  // টাইপ সংজ্ঞায়িত করা হলো
  switch (status) {
    case "approved":
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case "rejected":
      return <XCircle className="h-4 w-4 text-red-600" />;
    default: // pending
      return <Clock className="h-4 w-4 text-yellow-600" />;
  }
};

const getStatusColor = (status: Application["status"]) => {
  // টাইপ সংজ্ঞায়িত করা হলো
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-800";
    case "rejected":
      return "bg-red-100 text-red-800";
    default: // pending
      return "bg-yellow-100 text-yellow-800";
  }
};

export default function ApplicationPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const [userId, setUserId] = useState<string | null>(null); // Firebase সরানো হয়েছে, তাই এটি আর প্রয়োজন নেই

  useEffect(() => {
    // Firebase initialization এবং data fetching logic সরানো হলো।
    // এখানে আপনি আপনার API বা অন্য কোনো ডেটা সোর্স থেকে ডেটা আনতে পারেন।
    // আপাতত, mock data ব্যবহার করা হলো।
    setTimeout(() => {
      // ডেটা লোডিং সিমুলেট করার জন্য একটি ছোট বিলম্ব
      setApplications(mockApplications);
      setLoading(false);
      setError(null); // কোনো এরর নেই ধরে নেওয়া হলো
    }, 1000); // 1 সেকেন্ড বিলম্ব

    // যদি কোনো cleanup function থাকে (যেমন WebSocket listener বন্ধ করা), তা এখানে রিটার্ন করুন।
    // return () => { /* cleanup logic here */ };
  }, []); // Empty dependency array means this effect runs once on mount

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        <p className="ml-2 text-lg text-indigo-600">Loading applications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50">
        <p className="text-red-700 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-8 bg-gray-50 min-h-screen font-sans">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="h-8 w-8 text-indigo-600" />
            Applications Management
          </h1>
          <p className="text-slate-600 mt-1">
            Review and manage student applications
          </p>
          {/* userId দেখানো সরানো হলো কারণ Firebase সরানো হয়েছে */}
          {/* {userId && (
            <p className="text-sm text-slate-500 mt-2">
              Current User ID: <span className="font-mono bg-gray-200 px-2 py-1 rounded-md">{userId}</span>
            </p>
          )} */}
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          Export Applications
        </Button>
      </div>

      {/* Search and Filter */}
      <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 rounded-xl">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search applications..."
                className="pl-10 rounded-lg"
              />
            </div>
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-transparent rounded-lg"
            >
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 rounded-xl">
        <CardHeader>
          <CardTitle className="text-slate-800">Recent Applications</CardTitle>
          <CardDescription>
            Manage student applications and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {applications.length === 0 ? (
              <div className="text-center text-slate-500 py-8">
                No applications found. Add some data!
              </div>
            ) : (
              applications.map((app) => (
                <div
                  key={app.id}
                  className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-xl bg-slate-50/50 hover:bg-slate-100/50 transition-colors border border-slate-100"
                >
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                    <div>
                      <p className="font-medium text-slate-800">
                        {app.studentName}
                      </p>
                      <p className="text-sm text-slate-600">ID: {app.id}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {app.course}
                      </p>
                      <p className="text-sm text-slate-600">{app.university}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Submitted</p>
                      <p className="text-sm font-medium text-slate-800">
                        {app.submittedDate}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-2 md:mt-0">
                      {getStatusIcon(app.status)}
                      <Badge
                        className={`${getStatusColor(
                          app.status
                        )} rounded-full px-3 py-1 text-xs font-semibold`}
                      >
                        {app.status.charAt(0).toUpperCase() +
                          app.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-0 md:ml-4 mt-4 md:mt-0 bg-transparent rounded-lg"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
