"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLMotionProps<"div"> {
  /** Anime l'entrée de la carte (fade + slide). */
  animate?: boolean;
  delay?: number;
}

export function Card({
  animate = false,
  delay = 0,
  className,
  children,
  ...props
}: CardProps) {
  const motionProps = animate
    ? {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.45, delay, ease: [0.21, 0.6, 0.35, 1] as const },
      }
    : {};

  return (
    <motion.div
      className={cn("card-soft p-5", className)}
      {...motionProps}
      {...props}
    >
      {children}
    </motion.div>
  );
}
