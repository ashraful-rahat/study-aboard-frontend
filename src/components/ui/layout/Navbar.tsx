"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Mock navLinks for demo - replace with your actual navLinks
const navLinks = [
  { name: "Home", path: "/" },
  { name: "Programs", path: "/programs" },
  { name: "Universities", path: "/universities" },
  { name: "Services", path: "/services" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 backdrop-blur-md bg-opacity-95 sticky top-0 z-50 border-b border-purple-500/20"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/" className="relative group">
              <motion.div
                className="absolute -inset-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              />
              <div className="relative text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Study Abroad
              </div>
            </Link>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-1">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.path}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Link
                  href={link.path}
                  className="relative group px-4 py-2 rounded-lg"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg opacity-0 group-hover:opacity-100"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  />
                  <motion.div
                    className={`relative z-10 font-medium transition-all duration-300 ${
                      pathname === link.path
                        ? "text-purple-300 font-semibold"
                        : "text-gray-300 group-hover:text-white"
                    }`}
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    {link.name}
                  </motion.div>
                  {pathname === link.path && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setOpen(!open)}
              className="relative p-2 text-gray-300 hover:text-white focus:outline-none"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg opacity-0 hover:opacity-100"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              />
              <motion.div
                animate={{ rotate: open ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="relative z-10"
              >
                {open ? <X size={24} /> : <Menu size={24} />}
              </motion.div>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden mt-4 overflow-hidden"
            >
              <motion.div
                className="bg-gradient-to-br from-slate-800/50 to-purple-900/50 backdrop-blur-sm rounded-xl border border-purple-500/20 p-4 space-y-2"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, duration: 0.2 }}
              >
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    <Link
                      href={link.path}
                      onClick={() => setOpen(false)}
                      className="relative group block"
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg opacity-0 group-hover:opacity-100"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      />
                      <motion.div
                        className={`relative z-10 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                          pathname === link.path
                            ? "text-purple-300 font-semibold bg-gradient-to-r from-purple-600/10 to-pink-600/10"
                            : "text-gray-300 group-hover:text-white"
                        }`}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                      >
                        {link.name}
                        {pathname === link.path && (
                          <motion.div
                            className="absolute left-0 top-1/2 w-1 h-6 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full transform -translate-y-1/2"
                            layoutId="activeMobileTab"
                            initial={false}
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 30,
                            }}
                          />
                        )}
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-pink-600/5 to-purple-600/5 pointer-events-none"
        animate={{
          background: [
            "linear-gradient(90deg, rgba(147, 51, 234, 0.05) 0%, rgba(219, 39, 119, 0.05) 50%, rgba(147, 51, 234, 0.05) 100%)",
            "linear-gradient(90deg, rgba(219, 39, 119, 0.05) 0%, rgba(147, 51, 234, 0.05) 50%, rgba(219, 39, 119, 0.05) 100%)",
            "linear-gradient(90deg, rgba(147, 51, 234, 0.05) 0%, rgba(219, 39, 119, 0.05) 50%, rgba(147, 51, 234, 0.05) 100%)",
          ],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />
    </motion.nav>
  );
}
