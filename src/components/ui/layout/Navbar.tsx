"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Define a type for your navigation items for better type safety
interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  // Explicitly type navItems as an array of NavItem
  { label: "Home", href: "/" },
  { label: "University", href: "/university" },
  { label: "Country", href: "/country" },
  { label: "Course", href: "/course" },
  { label: "Contact", href: "/contact" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
];

const linkVariants = {
  hidden: { opacity: 0, y: -15 },
  visible: { opacity: 1, y: 0, transition: { ease: "easeOut", duration: 0.3 } },
};

const menuVariants = {
  hidden: {
    height: 0,
    opacity: 0,
    transition: { ease: "easeInOut", duration: 0.3, when: "afterChildren" },
  },
  visible: {
    height: "auto",
    opacity: 1,
    transition: {
      ease: "easeInOut",
      duration: 0.5,
      staggerChildren: 0.08,
      when: "beforeChildren",
    },
  },
};

const Navbar: React.FC = () => {
  // Explicitly define Navbar as a React Functional Component
  const [menuOpen, setMenuOpen] = useState<boolean>(false); // Type for useState
  const [scrolled, setScrolled] = useState<boolean>(false); // Type for useState
  const pathname: string = usePathname(); // Type for usePathname

  useEffect(() => {
    const handleScroll = (): void => {
      // Type for handleScroll function
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Type for isActive function
  const isActive = (href: string): boolean => {
    return pathname === href;
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${
        scrolled
          ? "shadow-lg bg-white/95 backdrop-blur-md py-2" // On scroll: slightly transparent white
          : "shadow-md bg-white py-3" // Initial: solid white
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-3 lg:pb-4 flex justify-between items-center">
        {/* Removed extra whitespace from previous line */}
        {/* Logo */}
        <Link
          href="/"
          className={`text-2xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight select-none transition-colors duration-300 text-gray-800 hover:scale-105`} // Logo text always dark gray
        >
          Study
          <span className="text-blue-600">
            {" "}
            {/* Removed unnecessary comment within the span */}
            {/* Accent color always blue */}
            Abroad
          </span>
        </Link>
        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-x-6 lg:gap-x-10">
          {navItems.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={`relative px-2 py-1.5 rounded-md transition-all duration-200 group text-base lg:text-lg font-medium
                ${
                  isActive(href)
                    ? "text-blue-600 font-semibold" // Active: Blue text
                    : "text-gray-700 hover:text-blue-500" // Normal: Dark gray, Hover: Lighter blue
                }`}
            >
              {label}
              {/* Active Indicator (Underline) for Desktop */}
              {isActive(href) && (
                <motion.span
                  layoutId="activeIndicator"
                  className={`absolute left-0 bottom-0 w-full h-[2px] rounded-full bg-blue-600`} // Always blue underline
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              {/* Hover Underline for Desktop */}
              {!isActive(href) && (
                <span
                  className={`absolute left-1/2 bottom-0 w-0 h-[1.5px] rounded-full transition-all duration-300 group-hover:w-[80%] group-hover:left-[10%] bg-blue-500`} // Always blue hover underline
                />
              )}
            </Link>
          ))}
        </nav>
        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
          className="md:hidden p-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-gray-800 hover:bg-gray-100" // Icon always dark gray
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={menuOpen ? "x" : "menu"}
              initial={{ rotate: 0, opacity: 0 }}
              animate={{ rotate: menuOpen ? 90 : 0, opacity: 1 }}
              exit={{ rotate: menuOpen ? 0 : 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </motion.div>
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={menuVariants}
            className="md:hidden bg-white overflow-hidden px-4 sm:px-6 border-t border-gray-100 shadow-inner" // Mobile menu always white
          >
            <motion.ul className="flex flex-col space-y-2 py-4">
              {navItems.map(({ label, href }) => (
                <motion.li
                  key={href}
                  variants={linkVariants}
                  className="font-medium px-4"
                >
                  <Link
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className={`block py-3 rounded-lg text-center transition-colors duration-200
                      ${
                        isActive(href)
                          ? "text-blue-600 font-semibold bg-blue-50" // Active: Blue text, light blue background
                          : "text-gray-700 hover:bg-gray-50" // Normal: Dark gray, Hover: Very light gray background
                      }`}
                  >
                    {label}
                    {/* Active Indicator for Mobile - Centered and colored */}
                    {isActive(href) && (
                      <span className="block w-6 h-0.5 bg-blue-600 rounded-full mt-1 mx-auto" />
                    )}
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
