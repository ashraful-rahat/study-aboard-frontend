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
import { motion } from "framer-motion";
import type { TargetAndTransition, VariantLabels } from "framer-motion";

// ====== Sidebar UI Components ======
interface SidebarProps {
  children: React.ReactNode;
  className?: string;
}
const Sidebar: React.FC<SidebarProps> = ({ children, className }) => (
  <motion.aside
    initial={{ x: -250 }}
    animate={{ x: 0 }}
    transition={{ type: "spring", stiffness: 100, damping: 20 }}
    className={`w-64 bg-gradient-sidebar text-sidebar-text shadow-sidebar ${
      className || ""
    }`}
  >
    {children}
  </motion.aside>
);

const SidebarHeader: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div className={`p-4 ${className || ""}`}>{children}</div>
);

const SidebarContent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div className={`flex-1 overflow-y-auto ${className || ""}`}>{children}</div>
);

const SidebarGroup: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div className={`my-4 ${className || ""}`}>{children}</div>
);

const SidebarGroupLabel: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <h3
    className={`px-4 py-2 text-xs uppercase tracking-wider text-sidebar-text opacity-70 font-medium ${
      className || ""
    }`}
  >
    {children}
  </h3>
);

const SidebarGroupContent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div className={`space-y-1 ${className || ""}`}>{children}</div>
);

const SidebarMenu: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <ul className={className || ""}>{children}</ul>
);

const SidebarMenuItem: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <li className={className || ""}>{children}</li>
);

const SidebarMenuButton: React.FC<{
  children: React.ReactNode;
  className?: string;
  whileHover?: TargetAndTransition | VariantLabels;
  whileTap?: TargetAndTransition | VariantLabels;
}> = ({ children, className, whileHover, whileTap }) => (
  <motion.div
    whileHover={whileHover}
    whileTap={whileTap}
    className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 cursor-pointer ${
      className || ""
    }`}
  >
    {children}
  </motion.div>
);

// ====== Menu Items and Main Export ======
const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Countries", url: "/dashboard/countries", icon: MapPin },
  { title: "Courses", url: "/dashboard/courses", icon: BookOpen },
  { title: "Universities", url: "/dashboard/universities", icon: Building2 },
  { title: "Applications", url: "/dashboard/applications", icon: FileText },
  { title: "Services", url: "/dashboard/service", icon: FileText },
  { title: "Blog", url: "/dashboard/blogdashboard", icon: FileText },
  { title: "Users", url: "/dashboard/users", icon: Users },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r border-sidebar-accent backdrop-blur-sm">
      <SidebarHeader className="border-b border-sidebar-accent bg-white/5 backdrop-blur-sm">
        <div className="flex items-center gap-3 px-2 py-4">
          <div className="p-2 bg-white/10 rounded-lg">
            <GraduationCap className="h-6 w-6 text-sidebar-text-active" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-sidebar-text-active">
              EduPortal
            </h2>
            <p className="text-xs text-sidebar-text opacity-70">
              Admin Dashboard
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-white/5 backdrop-blur-sm">
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    whileHover={{
                      scale: 1.02,
                      backgroundColor: "rgba(255,255,255,0.15)",
                    }}
                    whileTap={{
                      scale: 0.98,
                      backgroundColor: "rgba(255,255,255,0.1)",
                    }}
                    className={`transition-all duration-200 mx-2 rounded-lg ${
                      pathname === item.url
                        ? "bg-sidebar-active text-sidebar-text-active shadow-lg shadow-sidebar-primary/20"
                        : "text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-text-active"
                    }`}
                  >
                    <Link
                      href={item.url}
                      className="flex items-center gap-3 w-full h-full"
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="font-medium">{item.title}</span>
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
