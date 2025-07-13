"use client";
import React from "react";
import { motion, useAnimation } from "framer-motion";
import { cn } from "@/utils/cn";

interface MovingBorderProps {
  children: React.ReactNode;
  containerClassName?: string;
  className?: string;
  borderColor?: string;
  duration?: number;
  borderWidth?: number;
}

export const MovingBorder: React.FC<MovingBorderProps> = ({
  children,
  containerClassName,
  className,
  borderColor = "#84CC16", // Default border color (Lime Green)
  duration = 3,
  borderWidth = 2,
}) => {
  const controls = useAnimation();

  const handleMouseEnter = () => {
    controls.start({
      pathLength: 1,
      transition: { duration, ease: "linear" },
    });
  };

  const handleMouseLeave = () => {
    controls.stop();
    controls.set({ pathLength: 0 });
  };

  return (
    <motion.div
      className={cn("relative p-[1px] overflow-hidden", containerClassName)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={cn("relative z-10", className)}>{children}</div>
      <motion.svg
        className="absolute inset-0 z-0"
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="none"
          stroke={borderColor}
          strokeWidth={borderWidth}
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset="1"
          style={{ strokeLinecap: "round" }}
          initial={{ pathLength: 0 }}
          animate={controls}
        />
      </motion.svg>
    </motion.div>
  );
};
