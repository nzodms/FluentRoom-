"use client";

import Link from "next/link";
import { MotionConfig } from "framer-motion";
import { Flame, Settings, Zap } from "lucide-react";
import { useProgress } from "@/lib/useProgress";
import { availableFP } from "@/lib/shop";
import { BottomNav, DesktopNav } from "./BottomNav";
import { Logo } from "./Logo";
import { AmbientBackground } from "@/components/ui/AmbientBackground";
import { cn } from "@/lib/utils";
import { todayKey } from "@/lib/utils";

/**
 * Shell de l'app connectée : header compact (logo · série · FP · réglages),
 * bottom nav mobile, colonne centrale mobile-first. Le contenu garde
 * toujours la place de respirer au-dessus de la nav (safe-area incluse).
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const { progress, ready } = useProgress();
  const activeToday = progress.lastActiveDate === todayKey();

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-dvh">
        <AmbientBackground />
        <header className="sticky top-0 z-40 glass border-b border-ink/5">
          <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 md:h-16 md:px-6">
            <Logo href="/app/today" />
            <DesktopNav />
            <div
              className={cn(
                "flex items-center gap-1.5 transition-opacity",
                !ready && "opacity-0",
              )}
            >
              {progress.onboarding && (
                <>
                  <span
                    className={cn(
                      "flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold",
                      activeToday
                        ? "bg-coral-50 text-coral-500"
                        : "bg-ink/5 text-ink-faint",
                    )}
                    aria-label={`Série de ${progress.streak} jours`}
                  >
                    <Flame
                      className="size-3.5"
                      fill={activeToday ? "currentColor" : "none"}
                    />
                    {progress.streak}
                  </span>
                  <span
                    className="flex items-center gap-1 rounded-full bg-gold-50 px-2.5 py-1 text-xs font-bold text-gold-500"
                    aria-label={`${availableFP(progress)} FP disponibles`}
                  >
                    <Zap className="size-3.5" fill="currentColor" />
                    {availableFP(progress)}
                  </span>
                </>
              )}
              <Link
                href="/app/settings"
                aria-label="Réglages"
                className="grid size-9 place-items-center rounded-full text-ink-soft transition-colors hover:bg-ink/5"
              >
                <Settings className="size-5" strokeWidth={2} />
              </Link>
            </div>
          </div>
        </header>

        {/* pb : hauteur de la nav + safe-area — aucun CTA ne passe dessous. */}
        <main className="mx-auto w-full max-w-xl px-4 pb-[calc(6.5rem+env(safe-area-inset-bottom))] pt-5 md:max-w-2xl md:px-6 md:pb-16">
          {children}
        </main>

        <BottomNav />
      </div>
    </MotionConfig>
  );
}
