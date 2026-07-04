"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { X } from "lucide-react";
import { AmbientBackground } from "@/components/ui/AmbientBackground";
import { cn } from "@/lib/utils";

interface SessionShellProps {
  /** Libellé court affiché à droite du header (ex: "⏰ Running Late"). */
  title: string;
  closeHref: string;
  stepLabels: string[];
  /** Index de l'étape courante ; >= stepLabels.length = écran final (header épuré). */
  currentStep: number;
  /** Clé de l'étape pour la transition animée. */
  stepKey: string | number;
  children: React.ReactNode;
}

/**
 * Session Mode : plein écran, une action à la fois, zéro scroll de page.
 * Le body est verrouillé pendant la session — seules les zones internes
 * des écrans peuvent défiler si nécessaire.
 */
export function SessionShell({
  title,
  closeHref,
  stepLabels,
  currentStep,
  stepKey,
  children,
}: SessionShellProps) {
  // Verrouille le scroll du document pendant la session.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const finished = currentStep >= stepLabels.length;

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex h-dvh flex-col overflow-hidden">
        <AmbientBackground />

        <header className="shrink-0 glass border-b border-ink/5">
          <div className="mx-auto flex h-13 max-w-lg items-center gap-3 px-4 py-2">
            <Link
              href={closeHref}
              aria-label="Quitter la session"
              className="grid size-9 shrink-0 place-items-center rounded-full text-ink-soft transition-colors hover:bg-ink/5"
            >
              <X className="size-5" strokeWidth={2.2} />
            </Link>
            <div className="min-w-0 flex-1">
              {!finished && (
                <div>
                  <div className="flex items-center gap-1">
                    {stepLabels.map((label, i) => (
                      <motion.span
                        key={label}
                        className={cn(
                          "h-1.5 flex-1 rounded-full",
                          i < currentStep
                            ? "gradient-mint"
                            : i === currentStep
                              ? "gradient-primary"
                              : "bg-ink/8",
                        )}
                        animate={i === currentStep ? { opacity: [1, 0.6, 1] } : {}}
                        transition={{ duration: 1.6, repeat: Infinity }}
                      />
                    ))}
                  </div>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-ink-faint">
                    {stepLabels[currentStep]} · {currentStep + 1}/
                    {stepLabels.length}
                  </p>
                </div>
              )}
            </div>
            <span className="shrink-0 truncate text-sm font-semibold text-ink-faint">
              {title}
            </span>
          </div>
        </header>

        <main className="mx-auto flex w-full max-w-lg min-h-0 flex-1 flex-col px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={stepKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.28, ease: [0.21, 0.6, 0.35, 1] }}
              className="flex min-h-0 flex-1 flex-col"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </MotionConfig>
  );
}
