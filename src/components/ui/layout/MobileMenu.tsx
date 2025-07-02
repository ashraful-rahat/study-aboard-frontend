import Link from "next/link";
import { User } from "lucide-react";

interface NavLink {
  name: string;
  path: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  navLinks: NavLink[];
  currentPath: string;
}

const MobileMenu = ({ isOpen, navLinks, currentPath }: MobileMenuProps) => {
  if (!isOpen) return null;

  return (
    <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
      <div className="px-4 py-4 space-y-3">
        {/* Mobile Navigation Links */}
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.path}
            className={`block px-3 py-2 text-base font-medium rounded-md transition-colors duration-200 ${
              currentPath === link.path
                ? "text-blue-600 bg-blue-50"
                : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            }`}
          >
            {link.name}
          </Link>
        ))}

        {/* Mobile Profile Section */}
        <div className="border-t border-gray-200 pt-4 mt-4">
          <div className="flex items-center space-x-3 px-3 py-2">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">John Doe</p>
              <p className="text-xs text-gray-500">john.doe@example.com</p>
            </div>
          </div>

          <div className="mt-3 space-y-1">
            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors duration-200">
              Profile Settings
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors duration-200">
              Notifications
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200">
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
