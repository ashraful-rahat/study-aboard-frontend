import React from "react";
import { UserCircle, Bell, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";

const DashboardHeader: React.FC = () => {
  return (
    <header className="bg-card p-4 md:p-6 border-b border-border flex justify-between items-center shadow-header backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 bg-accent/50 rounded-lg px-3 py-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm w-64"
          />
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-primary hover:bg-accent transition-all duration-200"
        >
          <Bell className="w-5 h-5" />
        </Button>

        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="p-1 bg-gradient-sidebar rounded-full">
            <UserCircle className="w-7 h-7 text-white" />
          </div>
          <div className="hidden sm:block">
            <span className="font-medium text-foreground text-sm">
              Admin User
            </span>
            <p className="text-xs text-muted-foreground">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
