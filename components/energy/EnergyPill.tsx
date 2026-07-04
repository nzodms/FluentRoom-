"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import type { UserProgress } from "@/types/learning";
import { MAX_ENERGY, currentEnergy } from "@/lib/energy";
import { cn } from "@/lib/utils";

/** Focus Energy : 5 points par jour, très visibles, jamais punitifs. */
export function EnergyPill({ progress }: { progress: UserProgress }) {
  const energy = currentEnergy(progress);
  const empty = energy === 0;

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 rounded-2xl px-3 py-2",
        empty ? "bg-ink/5" : "bg-primary-50",
      )}
      title={`${energy}/${MAX_ENERGY} Focus Energy — revient chaque jour`}
    >
      <Zap
        className={cn("size-4", empty ? "text-ink-faint" : "text-primary-500")}
        fill={empty ? "none" : "currentColor"}
      />
      <div className="flex gap-1">
        {Array.from({ length: MAX_ENERGY }, (_, i) => (
          <motion.span
            key={i}
            initial={false}
            animate={i < energy ? { scale: [1, 1.25, 1] } : {}}
            transition={{ duration: 0.3 }}
            className={cn(
              "size-2 rounded-full",
              i < energy ? "gradient-primary" : "bg-ink/10",
            )}
          />
        ))}
      </div>
      {energy > MAX_ENERGY && (
        <span className="text-xs font-bold text-primary-600">
          +{energy - MAX_ENERGY}
        </span>
      )}
    </div>
  );
}
