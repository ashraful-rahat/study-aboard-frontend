// components/Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "About us", href: "/about" },
  { label: "Destination", href: "/country" },
  { label: "Our Services", href: "/services" },
  { label: "Blog", href: "/blog" },
  // { label: "Applications", href: "/applications" },
  // { label: "Scholarships", href: "/Schoolership" },
  { label: "Contact us", href: "/contact" },
];

const linkVariants: Variants = {
  hidden: { opacity: 0, y: -15 },
  visible: { opacity: 1, y: 0, transition: { ease: "easeOut", duration: 0.3 } },
};

const menuVariants: Variants = {
  hidden: {
    opacity: 0,
    scaleY: 0,
    transition: {
      ease: "easeInOut",
      duration: 0.3,
      when: "afterChildren",
    },
  },
  visible: {
    opacity: 1,
    scaleY: 1,
    transition: {
      ease: "easeInOut",
      duration: 0.5,
      staggerChildren: 0.08,
      when: "beforeChildren",
    },
  },
};

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) => pathname === href;

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        // `fixed` এবং `z-50` যোগ করা হয়েছে
        scrolled
          ? "shadow-lg bg-white/98 backdrop-blur-md"
          : "shadow-sm bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 transition-transform duration-200 hover:scale-105"
          >
            <div className="flex items-center">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-sm lg:text-base">
                  P
                </span>
              </div>
              <div className="ml-2">
                <div className="text-lg lg:text-xl font-bold text-gray-800">
                  PFEC
                </div>
                <div className="text-xs lg:text-sm text-gray-600 -mt-1">
                  Study Abroad | Visa
                </div>
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-8 xl:space-x-10">
            {navItems.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className={`relative text-sm xl:text-base font-medium  md:text-md transition-colors duration-200 hover:text-blue-600 ${
                  isActive(href) ? "text-blue-600" : "text-gray-700"
                }`}
              >
                {label}
                {isActive(href) && (
                  <motion.span
                    layoutId="activeIndicator"
                    className="absolute left-0 -bottom-1 w-full h-0.5 bg-blue-600 rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Register + Mobile Menu */}
          <div className="flex items-center space-x-4">
            <Link
              href="/register"
              className="hidden sm:inline-flex items-center px-4 lg:px-6 py-2 lg:py-2.5 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-sm lg:text-base font-semibold rounded-full transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Register Now
            </Link>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle Menu"
              className="lg:hidden p-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-gray-700 hover:bg-gray-100"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={menuOpen ? "x" : "menu"}
                  initial={{ rotate: 0, opacity: 0 }}
                  animate={{ rotate: menuOpen ? 90 : 0, opacity: 1 }}
                  exit={{ rotate: menuOpen ? 0 : 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={menuVariants}
            style={{ transformOrigin: "top" }}
            className="lg:hidden bg-white border-t border-gray-100 shadow-lg fixed inset-x-0 top-16 z-40 overflow-y-auto max-h-[calc(100vh-64px)]" // `fixed`, `inset-x-0`, `top-16`, `z-40`, `overflow-y-auto`, `max-h` যোগ করা হয়েছে
          >
            <motion.div className="max-w-7xl mx-auto px-4 sm:px-6">
              <motion.ul className="flex flex-col py-4 space-y-1">
                {navItems.map(({ label, href }) => (
                  <motion.li key={href} variants={linkVariants}>
                    <Link
                      href={href}
                      onClick={() => setMenuOpen(false)}
                      className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${
                        isActive(href)
                          ? "text-blue-600 bg-blue-50"
                          : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                      }`}
                    >
                      {label}
                    </Link>
                  </motion.li>
                ))}
                <motion.li variants={linkVariants} className="pt-4">
                  <Link
                    href="/register"
                    onClick={() => setMenuOpen(false)}
                    className="block mx-4 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-center font-semibold rounded-full transition-all duration-200 shadow-lg"
                  >
                    Register Now
                  </Link>
                </motion.li>
              </motion.ul>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
