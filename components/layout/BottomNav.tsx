"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Sparkles,
  Headphones,
  Map as MapIcon,
  BookMarked,
  TrendingUp,
} from "lucide-react";
import { useProgress } from "@/lib/useProgress";
import { getDailySteps } from "@/lib/progress";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/app/today", label: "Aujourd'hui", icon: Sparkles },
  { href: "/app/listen", label: "Écoute", icon: Headphones },
  { href: "/app/adventure", label: "Aventure", icon: MapIcon },
  { href: "/app/phrases", label: "Phrases", icon: BookMarked },
  { href: "/app/progress", label: "Progrès", icon: TrendingUp },
];

/** Badge discret : action encore disponible sur cet onglet aujourd'hui. */
function useTabBadges(): Record<string, boolean> {
  const { progress, ready } = useProgress();
  if (!ready) return {};
  const steps = getDailySteps(progress);
  const hasPhrases = Object.keys(progress.phrases).length > 0;
  return {
    "/app/today": steps.length < 4,
    "/app/phrases": hasPhrases && !steps.includes("review"),
  };
}

export function BottomNav() {
  const pathname = usePathname();
  const badges = useTabBadges();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 md:hidden">
      <div className="glass border-t border-ink/5 px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-1.5">
        <div className="mx-auto flex max-w-md items-center justify-around">
          {tabs.map((tab) => {
            const active = pathname.startsWith(tab.href);
            const Icon = tab.icon;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="relative flex flex-col items-center gap-0.5 px-3 py-1"
              >
                {/* Capsule qui glisse sous l'onglet actif */}
                {active && (
                  <motion.span
                    layoutId="bottomnav-capsule"
                    className="absolute -top-0.5 -inset-x-1 bottom-0 rounded-2xl bg-primary-100/70"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <motion.span whileTap={{ scale: 0.82 }} className="relative">
                  <Icon
                    className={cn(
                      "size-[22px] transition-colors",
                      active ? "text-primary-600" : "text-ink-faint",
                    )}
                    strokeWidth={active ? 2.4 : 2}
                  />
                  {badges[tab.href] && !active && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -right-1 -top-0.5 size-2 rounded-full bg-coral-500 ring-2 ring-white"
                    />
                  )}
                </motion.span>
                <span
                  className={cn(
                    "relative text-[10px] font-semibold tracking-tight transition-colors",
                    active ? "text-primary-600" : "text-ink-faint",
                  )}
                >
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export function DesktopNav() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex items-center gap-1 rounded-full bg-white/70 border border-ink/5 p-1 shadow-soft">
      {tabs.map((tab) => {
        const active = pathname.startsWith(tab.href);
        const Icon = tab.icon;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "relative flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
              active ? "text-white" : "text-ink-soft hover:text-ink",
            )}
          >
            {active && (
              <motion.span
                layoutId="desktopnav-pill"
                className="absolute inset-0 rounded-full gradient-primary"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <Icon className="relative size-4" strokeWidth={2.2} />
            <span className="relative">{tab.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
