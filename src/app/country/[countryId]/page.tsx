// src/app/country/[countryId]/page.tsx
"use client";

import React, { useEffect, useState, useMemo } from "react"; // useMemo may not be needed here, but keeping for consistency if you add filters later
import { motion, AnimatePresence, Variants, Transition } from "framer-motion";
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
  ArrowLeft,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation"; // Next.js specific hooks
import axiosInstance from "@/utils/axios"; // Ensure this path is correct

// ========================================================================
// Custom UI Components (Button, Input, Badge, Card, CardContent)
// These are defined directly within this file for the CountryDetailsPage.
// ========================================================================

import { cn } from "@/utils/cn"; // Ensure cn utility function is available from your utils folder

// --- Custom Button Component ---
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
  HTMLElement,
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
      return React.cloneElement(
        React.Children.only(props.children as React.ReactElement),
        {
          ref,
          className: cn(
            baseStyles,
            variantStyles[variant],
            sizeStyles[size],
            (props.children as React.ReactElement).props.className,
            className
          ),
          ...props,
        }
      );
    }

    return (
      <Comp
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

// --- Custom Input Component (May not be strictly needed for this page, but included if you use it) ---
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

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

// --- Custom Card Component (May not be strictly needed for this page, but included if you use it for wrapping) ---
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm", // bg-card and text-card-foreground are shadcn-like CSS vars
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

// --- Custom CardContent Component (May not be strictly needed for this page, but included if you use it) ---
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
  // If your API has these fields, add them to the interface
  // studentsCount?: number;
  // establishedYear?: number;
}

// Framer Motion Variants - These are specific to this page's animations
// Not strictly needed as they are not re-used in other components, but can be kept for organization
const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const CountryDetailsPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const countryId = params.countryId as string;

  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!countryId) {
      setLoading(false);
      setError("Country ID is missing in the URL.");
      return;
    }

    const fetchDestinationDetails = async () => {
      try {
        // Adjust the API endpoint as per your backend
        // Example: /api/destination/{id} or /destination/{id}
        const res = await axiosInstance.get(`/destination/${countryId}`);
        setDestination(res.data.data); // Adjust based on your API response structure
      } catch (err) {
        console.error("Failed to load destination details:", err);
        setError(
          "Failed to load details for this destination. Please check the ID or try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDestinationDetails();
  }, [countryId]);

  // Loading State
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
            Loading Destination Details...
          </motion.h2>
          <p className="text-gray-500 mt-2">
            Preparing your journey around the world
          </p>
        </motion.div>
      </div>
    );
  }

  // Error State
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
            onClick={() => window.location.reload()} // Reload page to retry fetching
            className="bg-red-600 hover:bg-red-700"
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> Try Again
          </Button>
        </motion.div>
      </div>
    );
  }

  // Destination Not Found State (if API returns null or empty for a valid ID)
  if (!destination) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">
            Destination Not Found
          </h2>
          <p className="text-gray-500">
            The requested destination could not be found with ID: {countryId}.
          </p>
          <Button onClick={() => router.push("/country")} className="mt-6">
            <ArrowLeft className="w-5 h-5 mr-2" /> Back to All Destinations
          </Button>
        </div>
      </div>
    );
  }

  // Main Content for Country Details
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-20">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100/50"
        >
          {/* Hero Image Section */}
          <div className="relative h-96 w-full overflow-hidden">
            <img
              src={destination.photo}
              alt={destination.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end p-8">
              <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight">
                {destination.name}
              </h1>
            </div>
            {/* Country Badge */}
            <div className="absolute top-6 left-6 z-10">
              <Badge className="bg-white/95 backdrop-blur-sm text-gray-800 hover:bg-white shadow-lg px-4 py-2 rounded-full text-base">
                <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                {destination.country}
              </Badge>
            </div>
          </div>

          <div className="p-8 md:p-12">
            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-10"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                About {destination.name}
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {destination.description}
              </p>
            </motion.div>

            {/* Key Information & Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="flex items-center gap-4 bg-gray-50 p-6 rounded-xl border border-gray-200"
              >
                <Calendar className="w-8 h-8 text-emerald-600" />
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Best Time to Visit
                  </h3>
                  <p className="text-gray-600">{destination.bestTimeToVisit}</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="flex items-center gap-4 bg-gray-50 p-6 rounded-xl border border-gray-200"
              >
                <FileText className="w-8 h-8 text-amber-600" />
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Visa Requirements
                  </h3>
                  <p className="text-gray-600">
                    {destination.visaRequirements}
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="flex items-center gap-4 bg-gray-50 p-6 rounded-xl border border-gray-200"
              >
                <Star className="w-8 h-8 text-yellow-600 fill-yellow-600" />
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Student Visa Type
                  </h3>
                  <p className="text-gray-600">{destination.studentVisa}</p>
                </div>
              </motion.div>

              {/* Example of additional stats if available from API */}
              {/* If you have studentsCount or establishedYear in your Destination interface */}
              {/* {destination.studentsCount && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="flex items-center gap-4 bg-gray-50 p-6 rounded-xl border border-gray-200"
                >
                  <Users className="w-8 h-8 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Total Students</h3>
                    <p className="text-gray-600">{destination.studentsCount.toLocaleString()}+</p>
                  </div>
                </motion.div>
              )}
              {destination.establishedYear && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  className="flex items-center gap-4 bg-gray-50 p-6 rounded-xl border border-gray-200"
                >
                  <Clock className="w-8 h-8 text-purple-600" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Established In</h3>
                    <p className="text-gray-600">{destination.establishedYear}</p>
                  </div>
                </motion.div>
              )} */}
            </div>

            {/* Call to Action or Related Programs Section (Example) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="text-center mt-12 p-8 bg-blue-50 rounded-2xl border border-blue-200"
            >
              <h2 className="text-3xl font-bold text-blue-800 mb-4">
                Ready to Explore Programs in {destination.name}?
              </h2>
              <p className="text-blue-700 mb-6">
                Connect with our advisors to find the perfect course and
                university.
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg">
                <Globe className="w-5 h-5 mr-2" /> Find Programs
              </Button>
            </motion.div>

            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="text-center mt-12"
            >
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="px-6 py-3"
              >
                <ArrowLeft className="w-5 h-5 mr-2" /> Back to All Destinations
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CountryDetailsPage;
