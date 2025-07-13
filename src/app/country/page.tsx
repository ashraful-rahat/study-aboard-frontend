// pages/countries.tsx OR app/countries/page.tsx
"use client";

import axiosInstance from "@/utils/axios";
import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Image from "next/image"; // Import Next.js Image
import Link from "next/link"; // Import Next.js Link

// Import all necessary Lucide icons
import {
  Search,
  Filter,
  Globe,
  Calendar,
  FileText,
  ArrowRight,
  MapPin,
  Star,
  Users,
  Clock,
} from "lucide-react";

// ========================================================================
// Custom UI Components (Button, Input, Badge, Card, CardContent)
// Defined directly within this file, NOT imported from @/components/ui/
// ========================================================================

import { cn } from "@/utils/cn"; // Ensure cn utility function is available

// --- Custom Button Component ---
// (Corrected asChild and ref handling)
type AsProp<C extends React.ElementType> = {
  asChild?: boolean;
  as?: C;
};

type PropsToOmit<C extends React.ElementType, P> = keyof (AsProp<C> & P);

type PolymorphicComponentProps<
  C extends React.ElementType,
  Props = {}
> = React.PropsWithChildren<Props & AsProp<C>> &
  Omit<React.ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>;

export interface ButtonProps {
  variant?: "default" | "secondary" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<
  HTMLElement, // Ref can be any HTMLElement
  PolymorphicComponentProps<"button", ButtonProps>
>(
  (
    {
      className,
      variant = "default",
      size = "default",
      asChild = false,
      as: Comp = "button",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

    const variantStyles = {
      default: "bg-blue-600 text-white hover:bg-blue-700",
      secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
      outline:
        "border border-blue-600 bg-transparent text-blue-600 hover:bg-blue-50 hover:text-blue-700",
      ghost: "hover:bg-gray-100 hover:text-gray-900",
      link: "text-blue-600 underline-offset-4 hover:underline",
    };

    const sizeStyles = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    };

    if (asChild) {
      const child = React.Children.only(props.children);
      if (!React.isValidElement(child)) {
        throw new Error(
          "Children must be a single valid React element when asChild is true."
        );
      }
      // Pass the ref to the child, and combine classNames and other props
      return React.cloneElement(child, {
        ref,
        className: cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          child.props.className, // Existing classes from the child
          className // Classes passed to the Button component itself
        ),
        // Merge remaining props from Button to the child (this ensures onClick, etc. are passed)
        ...props, // props from Button
        ...child.props, // props from child (child's props override Button's if duplicated)
      });
    }

    return (
      <Comp
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        ref={ref} // Pass ref here for the actual element being rendered
        {...props} // Pass remaining props
      />
    );
  }
);
Button.displayName = "Button";

// --- Custom Input Component ---
export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

// --- Custom Badge Component ---
export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "destructive";
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";

    const variantStyles = {
      default: "border-transparent bg-blue-500 text-white hover:bg-blue-600/80",
      secondary:
        "border-transparent bg-gray-100 text-gray-800 hover:bg-gray-100/80",
      outline: "text-gray-900",
      destructive:
        "border-transparent bg-red-500 text-white hover:bg-red-600/80",
    };

    return (
      <div
        className={cn(baseStyles, variantStyles[variant], className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";

// --- Custom Card Component ---
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

// --- Custom CardContent Component ---
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

// ========================================================================
// End Custom UI Components
// ========================================================================

interface Destination {
  _id: string;
  name: string;
  description: string;
  country: string;
  photo: string;
  bestTimeToVisit: string;
  visaRequirements: string;
  studentVisa: string;
}

// Framer Motion Variants for container and cards
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants: Variants = {
  hidden: { y: 60, opacity: 0, scale: 0.9 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.25, 0, 1], // FIX: Changed to string format for cubic-bezier
    },
  },
};

const AllCountriesPage: React.FC = () => {
  const [allDestinations, setAllDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<string>("all");

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await axiosInstance.get("/destination");
        setAllDestinations(res.data.data);
      } catch (err) {
        console.error("Failed to load destinations:", err);
        setError("Failed to load destinations. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  // Unique countries for the dropdown filter
  const uniqueCountries = useMemo(() => {
    const countries = new Set<string>();
    allDestinations.forEach((dest) => countries.add(dest.country));
    return Array.from(countries).sort();
  }, [allDestinations]);

  // Filtered destinations based on search and country filter
  const filteredDestinations = useMemo(() => {
    return allDestinations.filter((dest) => {
      const matchesSearch =
        searchTerm === "" ||
        dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dest.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dest.country.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCountry =
        selectedCountry === "all" || dest.country === selectedCountry;

      return matchesSearch && matchesCountry;
    });
  }, [allDestinations, searchTerm, selectedCountry]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative mb-8">
            <div className="w-24 h-24 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Globe className="w-8 h-8 text-blue-600 animate-pulse" />
            </div>
          </div>
          <motion.h2
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-2xl font-bold text-gray-700"
          >
            Loading Amazing Destinations...
          </motion.h2>
          <p className="text-gray-500 mt-2">
            Preparing your journey around the world
          </p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-12 bg-white rounded-3xl shadow-2xl border border-red-100 max-w-md mx-4"
        >
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-red-600 text-3xl">⚠</span>
          </div>
          <h2 className="text-2xl font-bold text-red-700 mb-4">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700"
          >
            Try Again
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16">
        <div className="absolute inset-0">
          {/* Animated background blobs */}
          <div className="absolute top-0 left-0 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
              className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg mb-8 border border-white/20"
            >
              <Globe
                className="w-6 h-6 text-blue-600 animate-spin"
                style={{ animationDuration: "3s" }}
              />
              <span className="text-sm font-semibold text-gray-700">
                Explore Global Education
              </span>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                {allDestinations.length} Destinations
              </Badge>
            </motion.div>

            <h1 className="text-7xl md:text-8xl font-black text-gray-900 leading-tight mb-8 tracking-tight">
              <span className="block">Discover Your</span>
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Dream Destination
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-12"
            >
              Embark on an educational journey across the globe. From historic
              universities in Europe to cutting-edge institutions in Asia, find
              your perfect study destination.
            </motion.p>

            {/* Search and Filter Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto"
            >
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search destinations, universities, or countries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-14 text-lg bg-white/80 backdrop-blur-sm border-white/20 shadow-lg rounded-2xl"
                />
              </div>

              <div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="pl-12 pr-8 h-14 text-lg bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg rounded-2xl appearance-none cursor-pointer min-w-[200px]"
                >
                  <option value="all">All Countries</option>
                  {uniqueCountries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="pb-20">
        <div className="container mx-auto px-6 max-w-7xl">
          <AnimatePresence mode="wait">
            {filteredDestinations.length === 0 && !loading ? (
              <motion.div
                key="no-results"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center py-20"
              >
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-3xl font-bold text-gray-700 mb-4">
                  No destinations found
                </h3>
                <p className="text-gray-500 text-lg mb-8">
                  Try adjusting your search terms or filters
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCountry("all");
                  }}
                  variant="outline"
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white hover:text-white"
                >
                  Clear Filters
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="destinations-grid"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredDestinations.map(
                  (
                    dest // 'index' প্যারামিটারটি সম্পূর্ণভাবে সরিয়ে দেওয়া হয়েছে
                  ) => (
                    <motion.div
                      key={dest._id}
                      variants={cardVariants}
                      whileHover={{
                        y: -12,
                        transition: { duration: 0.3, ease: "easeOut" },
                      }}
                      className="group relative"
                    >
                      <Card className="relative overflow-hidden bg-white/80 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-3xl">
                        {/* Background Glow */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        {/* Image Section */}
                        <div className="relative h-64 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10"></div>
                          {/* Use Next.js Image component */}
                          <Image
                            src={dest.photo}
                            alt={dest.name}
                            fill // Fill parent container
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Optimizes image loading based on viewport
                            className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                          />

                          {/* Country Badge */}
                          <div className="absolute top-4 left-4 z-20">
                            <Badge className="bg-white/95 backdrop-blur-sm text-gray-800 hover:bg-white shadow-lg px-3 py-2 rounded-full">
                              <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                              {dest.country}
                            </Badge>
                          </div>

                          {/* Rating Badge (assuming a static rating for now, replace with dynamic if available) */}
                          <div className="absolute top-4 right-4 z-20">
                            <Badge className="bg-amber-500/95 backdrop-blur-sm text-white shadow-lg px-3 py-2 rounded-full">
                              <Star className="w-4 h-4 mr-1 fill-current" />
                              4.8
                            </Badge>
                          </div>
                        </div>

                        <CardContent className="p-8">
                          {/* Title */}
                          <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-700 transition-colors duration-300">
                            {dest.name}
                          </h3>

                          {/* Description */}
                          <p className="text-gray-600 leading-relaxed mb-6 line-clamp-3">
                            {dest.description.length > 120
                              ? `${dest.description.substring(0, 120)}...`
                              : dest.description}
                          </p>

                          {/* Info Tags */}
                          <div className="flex flex-wrap gap-3 mb-8">
                            <Badge
                              variant="secondary"
                              className="bg-emerald-50 text-emerald-700 border-emerald-200 px-3 py-2 rounded-xl"
                            >
                              <Calendar className="w-4 h-4 mr-2" />
                              <span className="font-medium">
                                {dest.bestTimeToVisit}
                              </span>
                            </Badge>
                            <Badge
                              variant="secondary"
                              className="bg-amber-50 text-amber-700 border-amber-200 px-3 py-2 rounded-xl"
                            >
                              <FileText className="w-4 h-4 mr-2" />
                              <span className="font-medium">
                                {dest.studentVisa}
                              </span>
                            </Badge>
                          </div>

                          {/* Stats */}
                          {/* These are dummy data. Remove or fetch from API if available. */}
                          <div className="flex items-center gap-6 mb-8 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              <span>25K+ Students</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>Est. 1845</span>
                            </div>
                          </div>

                          {/* Action Button: Link to Country Details Page */}
                          <Button
                            asChild // This makes Button pass its props to the child (Link)
                            className="w-full group/btn relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 text-white py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98]"
                          >
                            {/* Link component should be the direct child. It internally renders <a>. */}
                            <Link
                              href={`/country/${dest._id}`}
                              className="relative z-10 flex items-center justify-center gap-2 w-full"
                            >
                              Explore Programs
                              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-1" />
                            </Link>
                          </Button>
                        </CardContent>

                        {/* Decorative Elements (Blobs) */}
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-tr from-purple-400/10 to-pink-400/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                      </Card>
                    </motion.div>
                  )
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};

export default AllCountriesPage;
