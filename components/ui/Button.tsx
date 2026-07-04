"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "mint" | "coral" | "outline";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "gradient-primary text-white shadow-[0_8px_24px_-8px_rgba(88,92,226,0.55)] hover:shadow-[0_10px_28px_-6px_rgba(88,92,226,0.6)]",
  secondary:
    "bg-white text-ink border border-ink/8 shadow-soft hover:border-primary-200",
  ghost: "bg-transparent text-ink-soft hover:bg-ink/5",
  mint: "gradient-mint text-white shadow-[0_8px_24px_-8px_rgba(44,183,131,0.5)]",
  coral:
    "bg-coral-500 text-white shadow-[0_8px_24px_-8px_rgba(249,113,74,0.5)]",
  outline:
    "bg-transparent text-primary-600 border-2 border-primary-200 hover:border-primary-400 hover:bg-primary-50",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-10 px-4 text-sm rounded-2xl",
  md: "h-12 px-6 text-[15px] rounded-2xl",
  lg: "h-14 px-8 text-base rounded-3xl",
};

export function Button({
  variant = "primary",
  size = "md",
  fullWidth,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: 1.015 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-semibold tracking-tight select-none cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed transition-shadow",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
