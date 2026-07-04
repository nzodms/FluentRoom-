"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function ProgressBar({
  value,
  className,
  color = "gradient-primary",
}: {
  /** 0–100 */
  value: number;
  className?: string;
  color?: string;
}) {
  return (
    <div
      className={cn("h-2 w-full rounded-full bg-ink/8 overflow-hidden", className)}
    >
      <motion.div
        className={cn("h-full rounded-full", color)}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        transition={{ duration: 0.7, ease: [0.21, 0.6, 0.35, 1] }}
      />
    </div>
  );
}
