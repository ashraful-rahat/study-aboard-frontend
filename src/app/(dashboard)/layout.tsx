"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation"; // Next 13 app router
import { useAuth } from "@/hooks/useAuth"; // তোমার useAuth hook থেকে
import { AppSidebar } from "./AppSidebar";
import DashboardHeader from "./DashboardHeader";
import { Toaster } from "sonner";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/Login");
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // বা Loading এর মত কিছু দেখাও যতক্ষণ redirect হচ্ছে
  }

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">{children}</main>
        <Toaster richColors position="top-right" />
      </div>
    </div>
  );
}
