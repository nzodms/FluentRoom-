"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import type { CharacterExpression } from "@/components/avatar/FluentCharacter";
import { FluentCharacter } from "@/components/avatar/FluentCharacter";
import { DEFAULT_AVATAR } from "@/data/avatar-items";
import { Button } from "@/components/ui/Button";
import { loadJSON, saveJSON } from "@/lib/storage";
import { cn } from "@/lib/utils";

/**
 * Guided tour premium : spotlight animé qui zoome de zone en zone,
 * fond assombri, bulle coach avec le personnage. Tout en
 * transform/opacity, overlay monté en continu — zéro flicker.
 */

export interface TourStep {
  id: string;
  /** Valeur de l'attribut data-tour de l'élément ciblé. */
  target: string;
  title: string;
  message: string;
  expression?: CharacterExpression;
  shape?: "rounded" | "circle" | "pill";
  accent?: "primary" | "mint" | "gold";
}

interface TourState {
  seen: boolean;
  skipped?: boolean;
}

function tourKey(name: string) {
  return `tour-${name}`;
}

export function hasSeenTour(name: string): boolean {
  return loadJSON<TourState>(tourKey(name), { seen: false }).seen;
}

export function markTourSeen(name: string, skipped = false): void {
  saveJSON<TourState>(tourKey(name), { seen: true, skipped });
}

export function resetTour(name: string): void {
  saveJSON<TourState>(tourKey(name), { seen: false });
}

/** État d'un tour : démarre une fois le layout stable, jamais deux fois. */
export function useGuidedTour(name: string, enabled: boolean, delayMs = 900) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!enabled || hasSeenTour(name)) return;
    const t = setTimeout(() => setOpen(true), delayMs);
    return () => clearTimeout(t);
  }, [enabled, name, delayMs]);

  const close = useCallback(
    (skipped: boolean) => {
      markTourSeen(name, skipped);
      setOpen(false);
    },
    [name],
  );

  return { open, close };
}

const ACCENT = {
  primary: { halo: "rgba(88,92,226,0.55)", ring: "rgba(88,92,226,0.8)" },
  mint: { halo: "rgba(44,183,131,0.5)", ring: "rgba(44,183,131,0.8)" },
  gold: { halo: "rgba(224,163,46,0.5)", ring: "rgba(224,163,46,0.85)" },
} as const;

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export function GuidedTour({
  steps,
  onClose,
}: {
  steps: TourStep[];
  /** skipped = l'utilisateur a passé avant la fin. */
  onClose: (skipped: boolean) => void;
}) {
  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);
  const measureTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const step = steps[index];

  const measure = useCallback(() => {
    const el = document.querySelector<HTMLElement>(
      `[data-tour="${step.target}"]`,
    );
    if (!el) return;
    const r = el.getBoundingClientRect();
    setRect({ x: r.left, y: r.top, w: r.width, h: r.height });
  }, [step.target]);

  // Cible : scroll doux vers l'élément, puis mesure une fois stable.
  useEffect(() => {
    const el = document.querySelector<HTMLElement>(
      `[data-tour="${step.target}"]`,
    );
    if (!el) {
      // Cible absente : on saute l'étape plutôt que d'afficher un focus vide.
      const skip = setTimeout(() => {
        if (index < steps.length - 1) setIndex((i) => i + 1);
        else onClose(false);
      }, 0);
      return () => clearTimeout(skip);
    }
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    measureTimer.current = setTimeout(() => {
      requestAnimationFrame(measure);
    }, 420);
    return () => {
      if (measureTimer.current) clearTimeout(measureTimer.current);
    };
  }, [step.target, index, steps.length, measure, onClose]);

  useEffect(() => {
    const onResize = () => requestAnimationFrame(measure);
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, { passive: true });
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize);
    };
  }, [measure]);

  if (!step) return null;
  const accent = ACCENT[step.accent ?? "primary"];
  const pad = step.shape === "pill" ? 8 : 12;
  const radius =
    step.shape === "circle"
      ? 9999
      : step.shape === "pill"
        ? 999
        : 24;
  const isLast = index === steps.length - 1;
  // Bulle en bas si la cible est en haut de l'écran, et inversement.
  const bubbleAtBottom =
    rect === null ||
    rect.y + rect.h / 2 <
      (typeof window !== "undefined" ? window.innerHeight : 800) / 2;

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        className="fixed inset-0 z-[90]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        role="dialog"
        aria-label="Visite guidée"
      >
        {rect && (
          <>
            {/* Spotlight : découpe la scène, morphe de cible en cible */}
            <motion.div
              className="absolute left-0 top-0"
              initial={false}
              animate={{
                x: rect.x - pad,
                y: rect.y - pad,
                width: rect.w + pad * 2,
                height: rect.h + pad * 2,
                borderRadius: radius,
              }}
              transition={{ type: "spring", stiffness: 220, damping: 28 }}
              style={{
                boxShadow: "0 0 0 200vmax rgba(23,26,38,0.5)",
              }}
            >
              {/* Halo qui respire */}
              <motion.span
                aria-hidden
                className="absolute -inset-1 rounded-[inherit]"
                animate={{
                  boxShadow: [
                    `0 0 0 2px ${accent.ring}, 0 0 24px 2px ${accent.halo}`,
                    `0 0 0 2px ${accent.ring}, 0 0 38px 8px ${accent.halo}`,
                    `0 0 0 2px ${accent.ring}, 0 0 24px 2px ${accent.halo}`,
                  ],
                }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>

            {/* Bulle coach */}
            <div
              className={cn(
                "absolute inset-x-0 px-4",
                bubbleAtBottom
                  ? "bottom-[max(env(safe-area-inset-bottom),1rem)]"
                  : "top-[max(env(safe-area-inset-top),1rem)]",
              )}
            >
              <motion.div
                layout
                initial={{ opacity: 0, y: bubbleAtBottom ? 24 : -24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 26 }}
                className="mx-auto max-w-md rounded-[1.75rem] bg-white/95 p-4 shadow-lift backdrop-blur-md"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.22 }}
                    className="flex items-start gap-3"
                  >
                    <div className="shrink-0">
                      <FluentCharacter
                        config={DEFAULT_AVATAR}
                        size={56}
                        expression={step.expression ?? "happy"}
                        showBackground={false}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-ink">{step.title}</p>
                      <p className="mt-0.5 text-sm leading-snug text-ink-soft">
                        {step.message}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="mt-3 flex items-center gap-3">
                  {/* Progress dots */}
                  <div className="flex gap-1.5">
                    {steps.map((s, i) => (
                      <span
                        key={s.id}
                        className={cn(
                          "size-1.5 rounded-full transition-all",
                          i === index
                            ? "w-5 bg-primary-500"
                            : i < index
                              ? "bg-mint-500"
                              : "bg-ink/15",
                        )}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => onClose(true)}
                    className="ml-auto cursor-pointer text-xs font-semibold text-ink-faint transition-colors hover:text-ink"
                  >
                    Passer
                  </button>
                  <Button
                    size="sm"
                    onClick={() =>
                      isLast ? onClose(false) : setIndex((i) => i + 1)
                    }
                  >
                    {isLast ? "C'est parti" : "Suivant"}
                  </Button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </motion.div>
    </MotionConfig>
  );
}
