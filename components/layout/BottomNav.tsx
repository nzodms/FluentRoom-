"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Sparkles,
  Headphones,
  Mic,
  BookMarked,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/app/today", label: "Today", icon: Sparkles },
  { href: "/app/listen", label: "Listen", icon: Headphones },
  { href: "/app/speak", label: "Speak", icon: Mic },
  { href: "/app/phrases", label: "Phrases", icon: BookMarked },
  { href: "/app/progress", label: "Progress", icon: TrendingUp },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 md:hidden">
      <div className="glass border-t border-ink/5 px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2">
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
                {active && (
                  <motion.span
                    layoutId="bottomnav-pill"
                    className="absolute -top-1 h-1 w-8 rounded-full gradient-primary"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <Icon
                  className={cn(
                    "size-[22px] transition-colors",
                    active ? "text-primary-600" : "text-ink-faint",
                  )}
                  strokeWidth={active ? 2.4 : 2}
                />
                <span
                  className={cn(
                    "text-[10px] font-semibold tracking-tight transition-colors",
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
