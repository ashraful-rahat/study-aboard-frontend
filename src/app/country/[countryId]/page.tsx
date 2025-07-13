"use client";

import React, { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import { Globe, Calendar, FileText, Star } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import axiosInstance from "@/utils/axios";
import { cn } from "@/utils/cn";
import Image from "next/image";
// --- Button Component ---
type AsProp<C extends React.ElementType> = {
  asChild?: boolean;
  as?: C;
};

type PropsToOmit<C extends React.ElementType, P> = keyof (AsProp<C> & P);

type PolymorphicComponentProps<
  C extends React.ElementType,
  Props = { "0": never }
> = React.PropsWithChildren<Props & AsProp<C>> &
  Omit<React.ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>;
export interface ButtonProps {
  variant?: "default" | "secondary" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

const Button = React.forwardRef<
  HTMLButtonElement,
  PolymorphicComponentProps<"button", ButtonProps>
>(
  (
    {
      className,
      variant = "default",
      size = "default",
      asChild = false,
      as,
      ...props
    },
    ref
  ) => {
    const Comp: React.ElementType = asChild ? "span" : as || "button";

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

// --- Badge Component ---
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

// --- Variants ---
const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

// --- Destination Interface ---
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

// --- Main Page Component ---
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
        const res = await axiosInstance.get(`/destination/${countryId}`);
        setDestination(res.data.data);
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

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-600">
        <p>{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="text-center py-20 text-gray-600">
        <p>No destination found for ID: {countryId}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-20">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100/50"
        >
          <div className="relative h-96 w-full overflow-hidden">
            <Image
              src={destination.photo}
              alt={destination.name}
              fill
              className="object-cover w-full h-full"
              priority // Optional: eager loading
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end p-8">
              <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight">
                {destination.name}
              </h1>
            </div>
            <div className="absolute top-6 left-6 z-10">
              <Badge>{destination.country}</Badge>
            </div>
          </div>

          <div className="p-8 md:p-12">
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="mb-10"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                About {destination.name}
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                {destination.description}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="bg-gray-50 p-6 rounded-xl border"
              >
                <Calendar className="text-emerald-600 mb-2" />
                <h3 className="font-semibold text-gray-800">
                  Best Time to Visit
                </h3>
                <p className="text-gray-600">{destination.bestTimeToVisit}</p>
              </motion.div>
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="bg-gray-50 p-6 rounded-xl border"
              >
                <FileText className="text-amber-600 mb-2" />
                <h3 className="font-semibold text-gray-800">
                  Visa Requirements
                </h3>
                <p className="text-gray-600">{destination.visaRequirements}</p>
              </motion.div>
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="bg-gray-50 p-6 rounded-xl border"
              >
                <Star className="text-yellow-600 mb-2" />
                <h3 className="font-semibold text-gray-800">Student Visa</h3>
                <p className="text-gray-600">{destination.studentVisa}</p>
              </motion.div>
            </div>

            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="text-center mt-12"
            >
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg">
                <Globe className="w-5 h-5 mr-2" /> Find Programs
              </Button>
            </motion.div>

            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="text-center mt-6"
            >
              <Button variant="outline" onClick={() => router.push("/country")}>
                Back to All Destinations
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CountryDetailsPage;
