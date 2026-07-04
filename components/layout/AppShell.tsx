"use client";

import Link from "next/link";
import { MotionConfig } from "framer-motion";
import { Settings } from "lucide-react";
import { BottomNav, DesktopNav } from "./BottomNav";
import { Logo } from "./Logo";
import { AmbientBackground } from "@/components/ui/AmbientBackground";

/**
 * Shell de l'app connectée : fond vivant, header desktop + bottom nav
 * mobile, colonne centrale mobile-first. Respecte prefers-reduced-motion.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-dvh">
        <AmbientBackground />
        <header className="sticky top-0 z-40 glass border-b border-ink/5">
          <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 md:h-16 md:px-6">
            <Logo href="/app/today" />
            <DesktopNav />
            <Link
              href="/app/settings"
              aria-label="Réglages"
              className="grid size-9 place-items-center rounded-full text-ink-soft transition-colors hover:bg-ink/5"
            >
              <Settings className="size-5" strokeWidth={2} />
            </Link>
          </div>
        </header>

        <main className="mx-auto w-full max-w-xl px-4 pb-28 pt-5 md:max-w-2xl md:px-6 md:pb-16">
          {children}
        </main>

        <BottomNav />
      </div>
    </MotionConfig>
  );
}
