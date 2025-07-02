"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Course", path: "/course" },
  { name: "Universities", path: "/university" },
  { name: "Country", path: "/country" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("/");

  const handleLinkClick = (path: string) => {
    setActiveLink(path);
    setOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Simple Text */}
          <motion.div
            className="flex-shrink-0"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <button
              onClick={() => handleLinkClick("/")}
              className="text-2xl font-bold text-gray-900 tracking-tight hover:text-blue-600 transition-colors duration-300"
            >
              Study Abroad
            </button>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-1">
              {navLinks.map((link) => (
                <motion.button
                  key={link.path}
                  onClick={() => handleLinkClick(link.path)}
                  className="relative px-4 py-2 text-sm font-medium transition-colors duration-200"
                  whileHover={{ y: -1 }}
                  whileTap={{ y: 0 }}
                >
                  <span
                    className={`relative z-10 ${
                      activeLink === link.path
                        ? "text-blue-600"
                        : "text-gray-700 hover:text-gray-900"
                    }`}
                  >
                    {link.name}
                  </span>

                  {/* Active underline */}
                  {activeLink === link.path && (
                    <motion.div
                      layoutId="underline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow-md">
              Get Started
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              onClick={() => setOpen(!open)}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
              whileTap={{ scale: 0.95 }}
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-gray-100"
            >
              <div className="py-4 space-y-2">
                {navLinks.map((link, index) => (
                  <motion.button
                    key={link.path}
                    onClick={() => handleLinkClick(link.path)}
                    className="block w-full text-left px-4 py-3 text-base font-medium transition-colors duration-200"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <span
                      className={
                        activeLink === link.path
                          ? "text-blue-600 font-semibold"
                          : "text-gray-700 hover:text-gray-900"
                      }
                    >
                      {link.name}
                    </span>
                  </motion.button>
                ))}

                <div className="pt-4 px-4">
                  <button className="w-full px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200">
                    Get Started
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
