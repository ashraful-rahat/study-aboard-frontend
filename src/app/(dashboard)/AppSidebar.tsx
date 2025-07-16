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

interface SidebarProps {
  children: React.ReactNode;
  className?: string;
}
const Sidebar: React.FC<SidebarProps> = ({ children, className }) => (
  <aside className={`w-64 bg-gray-800 text-white ${className || ""}`}>
    {children}
  </aside>
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
    className={`px-4 py-2 text-xs uppercase tracking-wider ${className || ""}`}
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
}
const SidebarMenuButton: React.FC<SidebarMenuButtonProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 ${
        className || ""
      }`}
    >
      {children}
    </div>
  );
};

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
      <SidebarHeader className="border-b border-slate-200/60 bg-white/50 backdrop-blur-sm">
        <div className="flex items-center gap-2 px-2 py-4">
          <GraduationCap className="h-8 w-8 text-indigo-600" />
          <div>
            <h2 className="text-lg font-bold text-slate-800">EduPortal</h2>
            <p className="text-xs text-slate-600">Admin Dashboard</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-white/30 backdrop-blur-sm">
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-700 font-medium">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={`hover:bg-indigo-50 hover:text-indigo-700 ${
                      pathname === item.url
                        ? "data-[active=true] bg-indigo-100 text-indigo-800"
                        : ""
                    }`}
                  >
                    <Link href={item.url}>
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
