// app/(dashboard)/page.tsx অথবা আপনার DashboardHomePage কম্পোনেন্টের ফাইল
import React from "react";
import {
  Building2,
  Users,
  FileText,
  BookOpen,
  MapPin,
  TrendingUp,
} from "lucide-react";

// Card Component Props Type
interface CardProps {
  children: React.ReactNode;
  className?: string; // className কে ঐচ্ছিক করা হলো এবং টাইপ string
}
const Card: React.FC<CardProps> = ({ children, className }) => (
  <div
    className={`rounded-lg border bg-card text-card-foreground shadow-sm ${
      className || ""
    }`} // className না থাকলে খালি স্ট্রিং ব্যবহার করুন
  >
    {children}
  </div>
);

// CardHeader Component Props Type
interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}
const CardHeader: React.FC<CardHeaderProps> = ({ children, className }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className || ""}`}>
    {children}
  </div>
);

// CardTitle Component Props Type
interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}
const CardTitle: React.FC<CardTitleProps> = ({ children, className }) => (
  <h3
    className={`text-2xl font-semibold leading-none tracking-tight ${
      className || ""
    }`}
  >
    {children}
  </h3>
);

// CardDescription Component Props Type
interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}
const CardDescription: React.FC<CardDescriptionProps> = ({
  children,
  className,
}) => (
  <p className={`text-sm text-muted-foreground ${className || ""}`}>
    {children}
  </p>
);

// CardContent Component Props Type
interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}
const CardContent: React.FC<CardContentProps> = ({ children, className }) => (
  <div className={`p-6 pt-0 ${className || ""}`}>{children}</div>
);

// Badge Component Props Type
interface BadgeProps {
  children: React.ReactNode;
  variant?: "destructive" | "secondary" | "default"; // নির্দিষ্ট ভ্যারিয়েন্ট টাইপ
  className?: string;
}
const Badge: React.FC<BadgeProps> = ({ children, variant, className }) => {
  const baseClasses =
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
  let variantClasses = "";
  switch (variant) {
    case "destructive":
      variantClasses =
        "border-transparent bg-red-500 text-red-50 hover:bg-red-500/80";
      break;
    case "secondary":
      variantClasses =
        "border-transparent bg-gray-100 text-gray-800 hover:bg-gray-100/80";
      break;
    default:
      variantClasses =
        "border-transparent bg-primary text-primary-foreground hover:bg-primary/80";
  }
  return (
    <div className={`${baseClasses} ${variantClasses} ${className || ""}`}>
      {children}
    </div>
  );
};

// ----------------------------------------------------------------------
// বাকি কোড অপরিবর্তিত থাকবে

const stats = [
  {
    title: "Total Universities",
    value: "156",
    change: "+12%",
    icon: Building2,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Active Students",
    value: "2,847",
    change: "+23%",
    icon: Users,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    title: "Applications",
    value: "1,234",
    change: "+8%",
    icon: FileText,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    title: "Available Courses",
    value: "892",
    change: "+15%",
    icon: BookOpen,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
];

const recentActivities = [
  {
    action: "New application submitted",
    user: "John Doe",
    time: "2 minutes ago",
    status: "pending",
  },
  {
    action: "University profile updated",
    user: "Harvard University",
    time: "1 hour ago",
    status: "completed",
  },
  {
    action: "Course added",
    user: "MIT",
    time: "3 hours ago",
    status: "completed",
  },
  {
    action: "User registration",
    user: "Jane Smith",
    time: "5 hours ago",
    // status: "completed", // এটা ভুল ছিল, "completed" এর পরিবর্তে "success" বা "done" হতে পারে
    status: "completed", // এখানে `completed` স্ট্যাটাস ব্যবহার করা হয়েছে
  },
];

const DashboardHomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
      <style>
        {`
          body {
            font-family: 'Inter', sans-serif;
          }
        `}
      </style>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Dashboard Overview
            </h1>
            <p className="text-slate-600 mt-1">
              Welcome back! Here&lsquo;s what&lsquo;s happening with your
              platform.
            </p>
          </div>
          <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">
            <MapPin className="h-3 w-3 mr-1" />
            Global Platform
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card
              key={stat.title}
              className="bg-white/70 backdrop-blur-sm border-slate-200/60 hover:shadow-lg transition-shadow rounded-lg"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-800">
                  {stat.value}
                </div>
                <div className="flex items-center text-xs text-green-600 mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stat.change} from last month
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activities */}
        <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 rounded-lg">
          <CardHeader>
            <CardTitle className="text-slate-800">Recent Activities</CardTitle>
            <CardDescription>Latest updates from your platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50/50 hover:bg-slate-100/50 transition-colors"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800">
                      {activity.action}
                    </p>
                    <p className="text-xs text-slate-600">
                      {activity.user} • {activity.time}
                    </p>
                  </div>
                  <Badge
                    // activity.status এর উপর ভিত্তি করে সঠিক ভ্যারিয়েন্ট সেট করুন
                    variant={
                      activity.status === "pending"
                        ? "destructive" // এখানে 'destructive' ব্যবহার করা হয়েছে
                        : "secondary"
                    }
                    className={
                      activity.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }
                  >
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardHomePage;
