"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedCheckProps {
  size?: number;
  /** Délai avant le tracé. */
  delay?: number;
  className?: string;
  strokeWidth?: number;
}

/** Checkmark qui se dessine — le petit moment satisfaisant du succès. */
export function AnimatedCheck({
  size = 48,
  delay = 0,
  className,
  strokeWidth = 3.5,
}: AnimatedCheckProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={cn("text-current", className)}
    >
      <motion.path
        d="M4.5 12.5l5 5 10-11"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay, ease: [0.65, 0, 0.35, 1] }}
      />
    </svg>
  );
}
