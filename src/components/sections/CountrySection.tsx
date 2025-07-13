// src/components/sections/CountrySection.tsx
"use client";

import React, { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Calendar, FileText, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import axiosInstance from "@/utils/axios";

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

// Your button-specific props
export interface ButtonProps {
  variant?: "default" | "secondary" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

// Polymorphic button component
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
      children,
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
      const child = React.Children.only(
        children
      ) as React.ReactElement<unknown>;

      // Ensure child.props is typed
      const typedChild = child as React.ReactElement<
        { className?: string } & { ref?: React.Ref<HTMLElement> }
      >;

      return React.cloneElement(typedChild, {
        ...typedChild.props,
        ...props,
        className: cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          typedChild.props.className,
          className
        ),
        ref, // ✅ Now safely typed
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
      />
    );
  }
);
Button.displayName = "Button";

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

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

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

export const cardVariants: Variants = {
  hidden: { y: 60, opacity: 0, scale: 0.9 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.25, 0, 1],
    },
  },
};
const CountrySection: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await axiosInstance.get("/destination");
        // শুধুমাত্র প্রথম 3টি ডেটা নিন
        setDestinations(res.data.data.slice(0, 3));
      } catch (err) {
        console.error("Failed to load destinations:", err);
        setError("Failed to load destinations. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-blue-600 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center p-8 bg-red-50 rounded-2xl border border-red-200">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠</span>
          </div>
          <p className="text-xl text-red-700 font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border border-blue-200 mb-6"
          >
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <span className="text-blue-700 font-semibold">
              Premium Destinations
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-6xl font-black text-gray-900 leading-tight mb-6 tracking-tight"
          >
            Find Your Perfect
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Study Destination
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Explore our curated collection of world-renowned universities and
            study destinations. Each location offers unique opportunities to
            shape your academic future.
          </motion.p>
        </div>

        {/* Home page will show only 3 destinations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((dest: Destination, index: number) => (
            <motion.div
              key={dest._id}
              initial={{ opacity: 0, y: 60, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.7,
                delay: index * 0.15,
                ease: [0.25, 0.25, 0, 1],
              }}
              whileHover={{
                y: -8,
                transition: { duration: 0.3, ease: "easeOut" },
              }}
              className="group relative"
            >
              <Card className="relative bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100/50 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative h-56 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10"></div>
                  <Image // Use Next.js Image component
                    src={dest.photo}
                    alt={dest.name}
                    fill // Use fill to make image cover parent, and remove width/height
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Optimize image loading
                    className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                  />

                  <div className="absolute top-4 right-4 z-20">
                    <Badge className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20 shadow-lg">
                      <span className="text-xs font-bold text-gray-800 tracking-wide uppercase">
                        Featured
                      </span>
                    </Badge>
                  </div>

                  <div className="absolute bottom-4 left-4 z-20">
                    <Badge className="flex items-center gap-2 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-semibold text-gray-800">
                        {dest.country}
                      </span>
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-8">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors duration-300">
                      {dest.name}
                    </h3>
                    <p className="text-gray-600 leading-relaxed line-clamp-3">
                      {dest.description.length > 120
                        ? `${dest.description.substring(0, 120)}...`
                        : dest.description}
                    </p>
                  </div>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-sm">
                      <Badge
                        variant="secondary"
                        className="bg-emerald-50 text-emerald-700 px-3 py-2 rounded-xl border border-emerald-200"
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        <span className="font-medium">
                          {dest.bestTimeToVisit}
                        </span>
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Badge
                        variant="secondary"
                        className="bg-amber-50 text-amber-700 px-3 py-2 rounded-xl border border-amber-200"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        <span className="font-medium">{dest.studentVisa}</span>
                      </Badge>
                    </div>
                  </div>

                  {/* Action Button: Link to Country Details Page */}
                  <Button
                    asChild // Render as child to pass props to Link
                    className="w-full group/btn relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 text-white py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {/* The Link component itself. It will render an <a> tag internally. */}
                    <Link
                      href={`/country/${dest._id}`}
                      className="relative z-10 flex items-center justify-center gap-2 w-full"
                    >
                      Explore Program
                      <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>

                <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-tr from-purple-400/10 to-pink-400/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA Section to link to the full Countries page */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }} // Initial state for animation
          animate={{ opacity: 1, y: 0, scale: 1 }} // Animate to visible state
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }} // Smooth transition
          className="text-center mt-20" // Increased top margin
        >
          <div
            className="relative inline-flex items-center justify-center gap-6
                          bg-white/90 backdrop-blur-md px-10 py-5 rounded-full
                          border border-blue-200 shadow-xl
                          group overflow-hidden"
          >
            {/* Decorative background circle on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full scale-0 group-hover:scale-150 transition-transform duration-700 ease-out z-0"></div>

            <span className="relative z-10 text-gray-700 font-medium text-lg">
              Looking for more options?
            </span>

            <Button
              asChild // Render as child if using Next.js Link component (or a-tag directly)
              className="relative z-10 bg-gradient-to-r from-blue-600 to-purple-600 text-white
                         px-8 py-4 rounded-full font-semibold text-lg
                         hover:from-blue-700 hover:to-purple-700 transition-all duration-300
                         shadow-md hover:shadow-lg hover:scale-105 active:scale-95
                         flex items-center gap-2"
            >
              {/* The Link component itself. It will render an <a> tag internally. */}
              <Link href="/country" className="flex items-center gap-2">
                View All Destinations
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CountrySection;
