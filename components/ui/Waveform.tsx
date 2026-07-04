"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/** Barres pseudo-aléatoires mais déterministes (pas de mismatch SSR). */
function barHeights(count: number, seed: number): number[] {
  const heights: number[] = [];
  let x = seed;
  for (let i = 0; i < count; i++) {
    x = (x * 9301 + 49297) % 233280;
    heights.push(0.25 + (x / 233280) * 0.75);
  }
  return heights;
}

interface WaveformProps {
  playing: boolean;
  /** 0–1 : proportion des barres "lues". */
  progress?: number;
  bars?: number;
  className?: string;
  seed?: number;
}

export function Waveform({
  playing,
  progress = 0,
  bars = 36,
  className,
  seed = 7,
}: WaveformProps) {
  const heights = barHeights(bars, seed);
  const playedCount = Math.floor(progress * bars);

  return (
    <div className={cn("flex items-center gap-[3px] h-12", className)}>
      {heights.map((height, i) => {
        const played = i < playedCount;
        return (
          <motion.div
            key={i}
            className={cn(
              "flex-1 rounded-full",
              played ? "bg-primary-500" : "bg-primary-200/70",
            )}
            style={{ minWidth: 2 }}
            animate={
              playing
                ? {
                    scaleY: [height, height * 0.45, height * 0.9, height],
                  }
                : { scaleY: height }
            }
            transition={
              playing
                ? {
                    duration: 0.9,
                    repeat: Infinity,
                    delay: (i % 6) * 0.09,
                    ease: "easeInOut",
                  }
                : { duration: 0.3 }
            }
            initial={{ scaleY: height }}
          >
            <div className="h-12 w-full" />
          </motion.div>
        );
      })}
    </div>
  );
}
