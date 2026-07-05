"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, BarChart3, Clock3, Flame, Lock, Zap } from "lucide-react";
import type { AdventureNodeView } from "@/lib/adventure/types";
import { cn } from "@/lib/utils";

/**
 * La fiche flottante du bas : vignette illustrée du lieu, "Chapitre X",
 * grand titre, état, description, chips (durée · difficulté · FP) et
 * l'action juste — Commencer, Revoir, Ouvrir ou Lancer le défi.
 */

const STATE_CHIP: Record<string, { label: string; cls: string }> = {
  done: { label: "Terminé", cls: "bg-mint-50 text-mint-600" },
  current: { label: "En cours", cls: "bg-primary-100 text-primary-700" },
  available: { label: "Disponible", cls: "bg-coral-50 text-coral-500" },
  reward: { label: "Récompense", cls: "bg-gold-50 text-gold-500" },
  locked: { label: "Verrouillé", cls: "bg-ink/5 text-ink-faint" },
};

function ctaFor(node: AdventureNodeView): { label: string; disabled: boolean } {
  if (node.type === "chest") {
    if (node.state === "reward") return { label: "Ouvrir", disabled: false };
    if (node.state === "done") return { label: "Coffre ouvert", disabled: true };
    return { label: "Verrouillé", disabled: true };
  }
  if (node.type === "challenge") return { label: "Lancer le défi", disabled: false };
  if (node.state === "done") return { label: "Revoir", disabled: false };
  if (node.state === "current") return { label: "Commencer", disabled: false };
  return { label: "Verrouillé", disabled: true };
}

export function AdventureBottomSheet({
  node,
  onPrimary,
}: {
  node: AdventureNodeView;
  onPrimary: (node: AdventureNodeView) => void;
}) {
  const cta = ctaFor(node);
  const chip = STATE_CHIP[node.state];
  const overline =
    node.type === "chapter"
      ? `Chapitre ${node.step}`
      : node.type === "chest"
        ? "Bonus"
        : "Défi";

  return (
    <div
      data-testid="adventure-sheet"
      className="rounded-[1.9rem] border border-white/60 bg-white/95 p-3.5 shadow-lift backdrop-blur-md"
    >
      {/* Grab handle */}
      <div aria-hidden className="mx-auto mb-2.5 h-1.5 w-11 rounded-full bg-ink/10" />

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={node.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          <div className="flex items-start gap-3">
            <SheetVignette node={node} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold text-ink-soft">{overline}</p>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold",
                    chip.cls,
                  )}
                >
                  {chip.label}
                </span>
              </div>
              <h2 className="text-[1.2rem] font-bold leading-tight tracking-tight text-ink">
                {node.title}
              </h2>
              <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-ink-soft">
                {node.description}
              </p>
            </div>
          </div>

          {/* Chips durée · difficulté · récompense */}
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {node.meta.durationMin !== null && (
              <span className="flex items-center gap-1.5 rounded-full border border-ink/8 bg-white px-2.5 py-1 text-[11px] font-bold text-ink-soft">
                <Clock3 className="size-3" /> {node.meta.durationMin} min
              </span>
            )}
            {node.meta.difficultyFr && (
              <span className="flex items-center gap-1.5 rounded-full border border-mint-100 bg-mint-50 px-2.5 py-1 text-[11px] font-bold text-mint-600">
                <BarChart3 className="size-3" /> {node.meta.difficultyFr}
              </span>
            )}
            {node.meta.rewardFP !== null && (
              <span className="flex items-center gap-1.5 rounded-full bg-primary-50 px-2.5 py-1 text-[11px] font-bold text-primary-600">
                <Zap className="size-3" fill="currentColor" /> +{node.meta.rewardFP} FP
              </span>
            )}
          </div>

          {/* Condition de déblocage, quand il y en a une */}
          {node.lockedReason && (
            <p
              data-testid="adventure-locked-reason"
              className="mt-2.5 flex items-center gap-1.5 rounded-2xl bg-ink/[0.04] px-3 py-2 text-xs font-semibold text-ink-soft"
            >
              <Lock className="size-3.5 shrink-0 text-ink-faint" />
              {node.lockedReason}
            </p>
          )}

          <motion.button
            type="button"
            whileTap={cta.disabled ? undefined : { scale: 0.98 }}
            disabled={cta.disabled}
            data-testid="adventure-cta"
            onClick={() => onPrimary(node)}
            className={cn(
              "relative mt-3 flex h-12 w-full items-center justify-center rounded-full text-base font-bold text-white transition-opacity",
              cta.disabled ? "bg-ink/15 text-ink-faint" : "gradient-primary shadow-glow",
            )}
          >
            {cta.label}
            {!cta.disabled && (
              <ArrowRight className="absolute right-5 top-1/2 size-5 -translate-y-1/2" />
            )}
          </motion.button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/** Vignette illustrée du lieu — mini-scène chaude, pas une icône. */
function SheetVignette({ node }: { node: AdventureNodeView }) {
  if (node.type === "chest") {
    return (
      <span className="grid size-[62px] shrink-0 place-items-center overflow-hidden rounded-2xl shadow-soft">
        <svg viewBox="0 0 76 76" className="size-full" aria-hidden>
          <rect width="76" height="76" fill="#fbe7c2" />
          <circle cx="38" cy="34" r="24" fill="#ffe9a8" />
          <rect x="20" y="36" width="36" height="22" rx="4.5" fill="#8a5a18" />
          <path d="M20 36 q18 -13 36 0 Z" fill="#a86f1f" />
          <rect x="34" y="38" width="8" height="9" rx="3" fill="#eec153" />
          <circle cx="24" cy="20" r="2.2" fill="#ffd76e" />
          <circle cx="54" cy="16" r="1.8" fill="#ffd76e" />
        </svg>
      </span>
    );
  }
  if (node.type === "challenge") {
    return (
      <span className="relative grid size-[62px] shrink-0 place-items-center overflow-hidden rounded-2xl shadow-soft">
        <svg viewBox="0 0 76 76" className="absolute inset-0 size-full" aria-hidden>
          <rect width="76" height="76" fill="#fff1ec" />
          <circle cx="38" cy="38" r="22" fill="#ffe0d5" />
        </svg>
        <Flame className="relative size-8 text-coral-500" fill="currentColor" />
      </span>
    );
  }
  // Mini-gare : verrière chaude, horloge, sol doré.
  return (
    <span className="block size-[62px] shrink-0 overflow-hidden rounded-2xl shadow-soft">
      <svg viewBox="0 0 76 76" className="size-full" aria-hidden>
        <rect width="76" height="76" fill="#fbe7c2" />
        <path d="M-6 52 Q38 2 82 52 L82 0 L-6 0 Z" fill="#f9e0ac" />
        <path d="M-6 52 Q38 2 82 52" fill="none" stroke="#2c3556" strokeWidth="4" />
        <path d="M6 46 Q38 12 70 46" fill="none" stroke="#2c3556" strokeWidth="2" opacity="0.7" />
        <circle cx="38" cy="30" r="10" fill="#232b45" />
        <circle cx="38" cy="30" r="8" fill="#fffaf0" />
        <line x1="38" y1="30" x2="38" y2="24.5" stroke="#232b45" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="38" y1="30" x2="42" y2="32.5" stroke="#c8402f" strokeWidth="1.3" strokeLinecap="round" />
        <rect x="0" y="52" width="76" height="24" fill="#e9dcbd" />
        <path d="M28 52 L48 52 L58 76 L18 76 Z" fill="#f0e4c4" />
        <rect x="6" y="42" width="12" height="22" rx="2.5" fill="#c8402f" />
        <rect x="8.5" y="46" width="7" height="10" rx="1.5" fill="#f6e9cf" />
        <path d="M56 58 c-6 -5 -4 -12 2 -13 c6 1 8 8 2 13 Z" fill="#3f7d54" />
      </svg>
    </span>
  );
}
