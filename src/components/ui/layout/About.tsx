// src/app/about/page.tsx
"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Handshake,
  Award,
  Lightbulb,
  ArrowRight,

  // Added for completeness if these custom UI components are shared
} from "lucide-react";

import { cn } from "@/utils/cn";

// (Corrected Polymorphic Component type definition and ref handling)
type AsProp<C extends React.ElementType> = {
  asChild?: boolean;
  as?: C;
};

// Common props for all variants/sizes
interface BaseButtonProps {
  variant?: "default" | "secondary" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

// Full polymorphic props, allowing `as` to change the underlying element
type ButtonComponentProps<C extends React.ElementType> =
  React.PropsWithChildren<AsProp<C> & BaseButtonProps> &
    Omit<
      React.ComponentPropsWithoutRef<C>,
      keyof (AsProp<C> & BaseButtonProps)
    >;

// The forwardRef render function, correctly typed
const Button = React.forwardRef(
  <C extends React.ElementType = "button">( // Default element type
    {
      className,
      variant = "default",
      size = "default",
      asChild = false,
      as: Comp = "button", // Renamed to Comp to avoid keyword conflict
      ...props
    }: ButtonComponentProps<C>,
    ref?: React.Ref<C> // This ref type should be compatible with the 'as' element type
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
    } as const;

    const sizeStyles = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    } as const;

    const currentVariantStyle =
      variantStyles[variant as keyof typeof variantStyles];
    const currentSizeStyle = sizeStyles[size as keyof typeof sizeStyles];

    const combinedProps = {
      className: cn(
        baseStyles,
        currentVariantStyle,
        currentSizeStyle,
        className
      ),
      ref, // Pass ref here
      ...props,
    };

    if (asChild) {
      // Ensure props.children is a single React element for cloneElement
      const child = React.Children.only(props.children);
      if (!React.isValidElement(child)) {
        throw new Error(
          "Children must be a single valid React element when asChild is true."
        );
      }
      // Clone the child and merge props, allowing the child to receive the ref
      return React.cloneElement(child, {
        ...combinedProps, // Merge all props from Button (including ref)
        ...child.props, // Child's own props take precedence
        className: cn(combinedProps.className, child.props.className), // Combine classNames explicitly
      });
    }

    return <Comp {...combinedProps} />;
  }
);
Button.displayName = "Button";

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

// Framer Motion Variants for sections and elements
const fadeInVariant: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const staggerContainerVariant: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const childFadeInVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-20">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Hero / Introduction Section */}
        <motion.section
          variants={fadeInVariant}
          initial="hidden"
          animate="visible"
          className="text-center mb-20 relative z-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
            className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg mb-8 border border-white/20"
          >
            <Sparkles className="w-6 h-6 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-semibold text-gray-700">
              Our Journey, Your Future
            </span>
          </motion.div>
          <h1 className="text-6xl md:text-7xl font-black text-gray-900 leading-tight mb-6">
            Pioneering Global Education
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Since 2005
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            We are dedicated to transforming lives by connecting ambitious
            students with world-class educational opportunities across the
            globe. Our commitment to excellence, integrity, and personalized
            guidance sets us apart.
          </p>
        </motion.section>

        {/* Our Story Section */}
        <motion.section
          variants={fadeInVariant}
          initial="hidden"
          whileInView="visible" // Animates when it enters the viewport
          viewport={{ once: true, amount: 0.3 }} // Only animate once
          className="mb-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        >
          <motion.div variants={childFadeInVariant}>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Our Story: A Decade of Dreams
            </h2>
            <p className="text-gray-700 leading-loose mb-4">
              Founded in 2005 by a team of passionate educationists, our journey
              began with a simple yet profound vision: to make quality global
              education accessible to every aspiring student. We started as a
              small consultancy, driven by the belief that international
              exposure is key to personal and professional growth.
            </p>
            <p className="text-gray-700 leading-loose">
              Over the years, we have grown into a leading study abroad agency,
              building strong partnerships with hundreds of prestigious
              universities worldwide. Our success is measured by the success of
              our students, who have gone on to achieve remarkable feats in
              their chosen fields.
            </p>
          </motion.div>
          <motion.div
            variants={childFadeInVariant}
            className="relative aspect-video rounded-3xl overflow-hidden shadow-xl"
          >
            <Image
              src="/images/our-story.jpg" // Replace with a suitable image
              alt="Our Story"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </motion.div>
        </motion.section>
      </div>
    </div>
  );
};

export default AboutPage;
