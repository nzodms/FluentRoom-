"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, ShoppingBag } from "lucide-react";
import type { UserProgress } from "@/types/learning";
import { availableFP, nextAffordableHint } from "@/lib/shop";
import { cn } from "@/lib/utils";

/**
 * Teaser boutique : montre le solde FP et le prochain item atteignable.
 * Donne une raison concrète d'aller dépenser ses FP.
 */
export function ShopTeaser({
  progress,
  className,
}: {
  progress: UserProgress;
  className?: string;
}) {
  const balance = availableFP(progress);
  const hint = nextAffordableHint(progress);
  if (!hint) return null;

  const affordable = hint.missing === 0;

  return (
    <Link href="/app/shop" className={cn("block", className)}>
      <motion.div
        whileTap={{ scale: 0.98 }}
        className={cn(
          "flex items-center gap-3.5 rounded-3xl border p-4 transition-all hover:shadow-lift",
          affordable
            ? "border-gold-400/40 bg-gold-50"
            : "border-ink/8 bg-white shadow-soft",
        )}
      >
        <span
          className={cn(
            "relative grid size-11 shrink-0 place-items-center rounded-2xl",
            affordable ? "gradient-gold text-white" : "bg-primary-50 text-primary-600",
          )}
        >
          <ShoppingBag className="size-5" />
          {affordable && (
            <motion.span
              aria-hidden
              className="absolute inset-0 rounded-2xl bg-gold-400/50 blur-md"
              animate={{ opacity: [0.5, 0.9, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-ink">
            {affordable
              ? `Tu peux t'offrir « ${hint.name} » 🛍️`
              : `Plus que ${hint.missing} FP pour « ${hint.name} »`}
          </p>
          <p className="text-xs text-ink-soft">
            {balance} FP disponibles · Boutique
          </p>
        </div>
        <ChevronRight className="size-4 shrink-0 text-ink-faint" />
      </motion.div>
    </Link>
  );
}
