// components/AppSidebar.tsx
"use client";

import {
  Building2,
  GraduationCap,
  Home,
  MapPin,
  FileText,
  Users,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion"; // Framer Motion ইম্পোর্ট করুন

interface SidebarProps {
  children: React.ReactNode;
  className?: string;
}
const Sidebar: React.FC<SidebarProps> = ({ children, className }) => (
  // motion.aside ব্যবহার করা হয়েছে অ্যানিমেশনের জন্য
  <motion.aside
    initial={{ x: -250 }} // শুরুর অবস্থান (স্ক্রিনের বাইরে বাম দিকে)
    animate={{ x: 0 }} // শেষ অবস্থান (স্ক্রিনে)
    transition={{ type: "spring", stiffness: 100, damping: 20 }} // স্প্রিং অ্যানিমেশন
    className={`w-64 bg-gradient-to-br from-indigo-800 to-purple-900 text-white shadow-xl ${
      className || ""
    }`}
  >
    {children}
  </motion.aside>
);

interface SidebarHeaderProps {
  children: React.ReactNode;
  className?: string;
}
const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  children,
  className,
}) => <div className={`p-4 ${className || ""}`}>{children}</div>;

interface SidebarContentProps {
  children: React.ReactNode;
  className?: string;
}
const SidebarContent: React.FC<SidebarContentProps> = ({
  children,
  className,
}) => (
  <div className={`flex-1 overflow-y-auto ${className || ""}`}>{children}</div>
);

interface SidebarGroupProps {
  children: React.ReactNode;
  className?: string;
}
const SidebarGroup: React.FC<SidebarGroupProps> = ({ children, className }) => (
  <div className={`my-4 ${className || ""}`}>{children}</div>
);

interface SidebarGroupLabelProps {
  children: React.ReactNode;
  className?: string;
}
const SidebarGroupLabel: React.FC<SidebarGroupLabelProps> = ({
  children,
  className,
}) => (
  <h3
    className={`px-4 py-2 text-xs uppercase tracking-wider text-indigo-200/80 ${
      className || ""
    }`}
  >
    {children}
  </h3>
);

interface SidebarGroupContentProps {
  children: React.ReactNode;
  className?: string;
}
const SidebarGroupContent: React.FC<SidebarGroupContentProps> = ({
  children,
  className,
}) => <div className={`space-y-1 ${className || ""}`}>{children}</div>;

interface SidebarMenuProps {
  children: React.ReactNode;
  className?: string;
}
const SidebarMenu: React.FC<SidebarMenuProps> = ({ children, className }) => (
  <ul className={className || ""}>{children}</ul>
);

interface SidebarMenuItemProps {
  children: React.ReactNode;
  className?: string;
}
const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({
  children,
  className,
}) => <li className={className || ""}>{children}</li>;

interface SidebarMenuButtonProps {
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
  // Framer Motion props যোগ করা হলো
  whileHover?: object;
  whileTap?: object;
}
const SidebarMenuButton: React.FC<SidebarMenuButtonProps> = ({
  children,
  className,
  whileHover,
  whileTap,
}) => {
  return (
    // motion.div ব্যবহার করা হয়েছে অ্যানিমেশনের জন্য
    <motion.div
      whileHover={whileHover}
      whileTap={whileTap}
      className={`flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 cursor-pointer ${
        className || ""
      }`}
    >
      {children}
    </motion.div>
  );
};

// ----------------------------------------------------------------------

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Countries", url: "/dashboard/countries", icon: MapPin },
  { title: "Courses", url: "/dashboard/courses", icon: BookOpen },
  { title: "Universities", url: "/dashboard/universities", icon: Building2 },
  { title: "Applications", url: "/dashboard/applications", icon: FileText },
  { title: "Users", url: "/dashboard/users", icon: Users },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r border-slate-200/60">
      <SidebarHeader className="border-b border-slate-200/60 bg-white/10 backdrop-blur-sm">
        <div className="flex items-center gap-2 px-2 py-4">
          <GraduationCap className="h-8 w-8 text-indigo-300" />
          <div>
            <h2 className="text-lg font-bold text-white">EduPortal</h2>
            <p className="text-xs text-indigo-200/70">Admin Dashboard</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-white/5 backdrop-blur-sm">
        <SidebarGroup>
          <SidebarGroupLabel className="text-indigo-200/80 font-medium">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    // asChild prop এখানে সরাসরি ব্যবহার করা হচ্ছে না কারণ Link কে SidebarMenuButton এর child করা হয়েছে
                    // SidebarMenuButton নিজেই একটি motion.div, তাই Link কে এর child হিসেবে রেন্ডার করবে
                    whileHover={{
                      scale: 1.02,
                      backgroundColor: "rgba(255,255,255,0.1)",
                    }} // হোভার অ্যানিমেশন
                    whileTap={{
                      scale: 0.98,
                      backgroundColor: "rgba(255,255,255,0.05)",
                    }} // ক্লিক অ্যানিমেশন
                    className={`
                      text-indigo-100 hover:text-white transition-colors duration-200
                      ${
                        pathname === item.url
                          ? "bg-indigo-700/50 text-white shadow-inner" // সক্রিয় লিঙ্কের জন্য উজ্জ্বল ব্যাকগ্রাউন্ড
                          : "hover:bg-white/10" // নিষ্ক্রিয় লিঙ্কের জন্য হোভার ব্যাকগ্রাউন্ড
                      }
                    `}
                  >
                    <Link
                      href={item.url}
                      className="flex items-center gap-3 w-full h-full"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
