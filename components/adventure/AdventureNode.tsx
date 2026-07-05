"use client";

import { motion } from "framer-motion";
import { Check, Clock3, Flame, Lock } from "lucide-react";
import type { AdventureNodeView } from "@/lib/adventure/types";
import { cn } from "@/lib/utils";

/**
 * Un node de la scène : socle lumineux posé sur le chemin (vert
 * terminé, balise violette en cours, coffre doré, défi flamme,
 * cadenas sombre) + bulle-label premium. Tout le node est tappable.
 */

/**
 * Marqueur seul (socle dans la scène). Les bulles sont rendues dans
 * une couche séparée au-dessus de tout (AdventureNodeLabel) pour que
 * jamais un socle ne passe devant le texte d'une autre bulle.
 */
export function AdventureNode({
  node,
  selected,
  onSelect,
}: {
  node: AdventureNodeView;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <div
      className="absolute z-10"
      style={{ left: `${node.x}%`, top: `${node.y}%` }}
    >
      <motion.button
        type="button"
        data-testid={`adv-node-${node.id}`}
        aria-label={node.title}
        onClick={() => onSelect(node.id)}
        whileTap={{ scale: 0.9 }}
        className="relative block -translate-x-1/2 -translate-y-1/2 outline-none"
      >
        <NodeMarker node={node} selected={selected} />
      </motion.button>
    </div>
  );
}

/** Bulle-label, couche haute : cliquable, pointe vers son node. */
export function AdventureNodeLabel({
  node,
  selected,
  onSelect,
}: {
  node: AdventureNodeView;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <div
      className="absolute z-30"
      style={{ left: `${node.x}%`, top: `${node.y}%` }}
    >
      <button
        type="button"
        tabIndex={-1}
        aria-hidden
        data-testid={`adv-label-${node.id}`}
        onClick={() => onSelect(node.id)}
        className="relative block -translate-x-1/2 -translate-y-1/2 outline-none"
      >
        <span className="block" style={{ width: markerBox(node).w, height: markerBox(node).h }} />
        <NodeLabel node={node} selected={selected} />
      </button>
    </div>
  );
}

/** Encombrement du marqueur : la bulle s'ancre sur la même boîte. */
function markerBox(node: AdventureNodeView): { w: number; h: number } {
  if (node.type === "chest") return { w: 76, h: 62 };
  if (node.type === "challenge") return { w: 60, h: 54 };
  if (node.state === "done") return { w: 64, h: 52 };
  if (node.state === "current") return { w: 84, h: 66 };
  return { w: 52, h: 46 };
}

/* ---------- Marqueurs posés dans la scène ---------- */

function NodeMarker({
  node,
  selected,
}: {
  node: AdventureNodeView;
  selected: boolean;
}) {
  if (node.type === "chest") return <ChestMarker node={node} selected={selected} />;
  if (node.type === "challenge") return <ChallengeMarker selected={selected} />;
  if (node.state === "done") return <DonePedestal selected={selected} />;
  if (node.state === "current") return <CurrentBeacon selected={selected} />;
  return <LockedDisc selected={selected} />;
}

/** Socle vert lumineux : étape terminée. */
function DonePedestal({ selected }: { selected: boolean }) {
  return (
    <span className="relative grid h-[52px] w-[64px] place-items-center">
      <svg viewBox="0 0 64 52" className="absolute inset-0" aria-hidden>
        <ellipse cx="32" cy="40" rx="30" ry="11" fill="#2cb783" opacity="0.28" />
        <ellipse cx="32" cy="38" rx="24" ry="9" fill="#43cb95" opacity="0.55" />
        <ellipse cx="32" cy="36" rx="18" ry="6.5" fill="#d2f1e3" />
        <ellipse cx="32" cy="34.5" rx="18" ry="6.5" fill="#eafcf4" />
      </svg>
      <span
        className={cn(
          "relative -top-2 grid size-8 place-items-center rounded-full bg-white text-mint-500 shadow-soft ring-[3px] ring-mint-400",
          selected && "ring-4 ring-mint-500",
        )}
      >
        <Check className="size-4.5" strokeWidth={3.6} />
      </span>
    </span>
  );
}

/** Balise violette : chapitre en cours, le point le plus visible. */
function CurrentBeacon({ selected }: { selected: boolean }) {
  return (
    <span className="relative grid h-[66px] w-[84px] place-items-center">
      <motion.span
        aria-hidden
        className="absolute left-1/2 top-1/2 size-[84px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-400/25"
        animate={{ scale: [1, 1.2, 1], opacity: [0.8, 0.4, 0.8] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <svg viewBox="0 0 84 66" className="absolute inset-0" aria-hidden>
        <ellipse cx="42" cy="52" rx="38" ry="13" fill="#585ce2" opacity="0.3" />
        <ellipse cx="42" cy="49" rx="30" ry="10.5" fill="#7679e9" opacity="0.7" />
        <ellipse cx="42" cy="46" rx="23" ry="8" fill="#c3c4f6" />
        <ellipse cx="42" cy="43.5" rx="23" ry="8" fill="#dfdffb" />
        <ellipse cx="42" cy="42" rx="14" ry="5" fill="#f4f4ff" />
      </svg>
      <span
        className={cn(
          "relative -top-2.5 grid size-9 place-items-center rounded-full gradient-primary shadow-glow",
          selected && "ring-4 ring-primary-200",
        )}
      >
        <svg viewBox="0 0 20 20" className="size-4 text-white" aria-hidden>
          <path
            d="M10 1.5 L12.2 7 L18 7.6 L13.6 11.4 L15 17.4 L10 14.2 L5 17.4 L6.4 11.4 L2 7.6 L7.8 7 Z"
            fill="currentColor"
          />
        </svg>
      </span>
    </span>
  );
}

/** Cadenas sombre : étape encore verrouillée. */
function LockedDisc({ selected }: { selected: boolean }) {
  return (
    <span className="relative grid h-[46px] w-[52px] place-items-center">
      <svg viewBox="0 0 52 46" className="absolute inset-0" aria-hidden>
        <ellipse cx="26" cy="38" rx="20" ry="6.5" fill="#3a2c14" opacity="0.14" />
      </svg>
      <span
        className={cn(
          "relative -top-1 grid size-9 place-items-center rounded-full bg-[#4a5065] text-white shadow-soft ring-[3px] ring-white/80",
          selected && "ring-4 ring-primary-200",
        )}
      >
        <Lock className="size-4" strokeWidth={2.4} />
      </span>
    </span>
  );
}

/** Coffre doré posé sur le chemin. */
function ChestMarker({
  node,
  selected,
}: {
  node: AdventureNodeView;
  selected: boolean;
}) {
  const open = node.state === "done";
  const locked = node.state === "locked";
  return (
    <span className="relative grid h-[62px] w-[76px] place-items-center">
      {node.state === "reward" && (
        <motion.span
          aria-hidden
          className="absolute left-1/2 top-1/2 size-[80px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-400/35"
          animate={{ scale: [1, 1.18, 1], opacity: [0.8, 0.4, 0.8] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <svg
        viewBox="0 0 76 62"
        className={cn("relative", locked && "opacity-70 grayscale", selected && "drop-shadow-lg")}
        aria-hidden
      >
        <ellipse cx="38" cy="52" rx="26" ry="7.5" fill="#3a2c14" opacity="0.2" />
        {!locked && <ellipse cx="38" cy="50" rx="30" ry="10" fill="#ffd76e" opacity="0.5" />}
        {/* Corps */}
        <rect x="18" y="26" width="40" height="24" rx="5" fill="#8a5a18" />
        <rect x="18" y="26" width="40" height="24" rx="5" fill="none" stroke="#6e4611" strokeWidth="2" />
        <line x1="30" y1="26" x2="30" y2="50" stroke="#6e4611" strokeWidth="2" />
        <line x1="46" y1="26" x2="46" y2="50" stroke="#6e4611" strokeWidth="2" />
        {/* Couvercle */}
        <path
          d={open ? "M18 18 q20 -16 40 0 l0 4 l-40 0 Z" : "M18 26 q20 -15 40 0 Z"}
          fill="#a86f1f"
          stroke="#6e4611"
          strokeWidth="2"
        />
        {open && <ellipse cx="38" cy="24" rx="16" ry="5" fill="#ffe9a8" />}
        {/* Serrure */}
        <rect x="34" y={open ? 30 : 28} width="8" height="10" rx="3" fill="#eec153" stroke="#c98f2d" strokeWidth="1.5" />
        {!open && <circle cx="38" cy="32" r="1.6" fill="#8a5a18" />}
        {open && (
          <>
            <circle cx="30" cy="14" r="2.4" fill="#ffd76e" />
            <circle cx="46" cy="10" r="2" fill="#ffe9a8" />
            <circle cx="38" cy="6" r="1.6" fill="#ffd76e" />
          </>
        )}
      </svg>
    </span>
  );
}

/** Pastille défi : flamme sur fond corail, cerclée de blanc. */
function ChallengeMarker({ selected }: { selected: boolean }) {
  return (
    <span className="relative grid h-[54px] w-[60px] place-items-center">
      <svg viewBox="0 0 60 54" className="absolute inset-0" aria-hidden>
        <ellipse cx="30" cy="45" rx="20" ry="6.5" fill="#3a2c14" opacity="0.15" />
      </svg>
      <span
        className={cn(
          "relative -top-1 grid size-11 place-items-center rounded-full bg-white shadow-lift",
          selected && "ring-4 ring-coral-100",
        )}
      >
        <span className="grid size-8.5 place-items-center rounded-full gradient-coral text-white">
          <Flame className="size-4.5" fill="currentColor" />
        </span>
      </span>
    </span>
  );
}

/* ---------- Bulle-label ---------- */

const SIDE_CLASS: Record<string, string> = {
  right: "left-full top-1/2 ml-1.5 -translate-y-1/2",
  left: "right-full top-1/2 mr-1.5 -translate-y-1/2",
  top: "bottom-full left-1/2 mb-1.5 -translate-x-1/2",
  bottom: "top-full left-1/2 mt-1.5 -translate-x-1/2",
};

const TAIL_CLASS: Record<string, string> = {
  right: "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2",
  left: "right-0 top-1/2 translate-x-1/2 -translate-y-1/2",
  top: "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2",
  bottom: "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2",
};

function NodeLabel({
  node,
  selected,
}: {
  node: AdventureNodeView;
  selected: boolean;
}) {
  const numberCls =
    node.state === "done"
      ? "bg-mint-500 text-white"
      : node.state === "current"
        ? "bg-primary-500 text-white"
        : node.state === "reward"
          ? "bg-gold-400 text-white"
          : "bg-[#4a5065] text-white";

  const stateLine =
    node.type === "challenge" && node.meta.durationMin && node.meta.rewardFP ? (
      <span className="flex items-center gap-1 text-[10px] font-bold text-coral-500">
        <Clock3 className="size-3" /> {node.meta.durationMin} min · +{node.meta.rewardFP} FP
      </span>
    ) : node.state === "current" ? (
      <span className="flex items-center gap-1 text-[10px] font-bold text-primary-600">
        <Clock3 className="size-3" /> En cours
      </span>
    ) : node.state === "reward" ? (
      <span className="text-[10px] font-bold text-gold-500">Récompense</span>
    ) : node.state === "locked" ? (
      <span className="flex items-center gap-1 text-[10px] font-bold text-ink-faint">
        <Lock className="size-2.5" /> Verrouillé
      </span>
    ) : null;

  return (
    <span
      className={cn("absolute z-10 block w-max text-left", SIDE_CLASS[node.labelSide])}
    >
      <span
        className={cn(
          "relative block rounded-2xl bg-white/95 px-2.5 py-1.5 shadow-lift backdrop-blur-sm",
          selected && "ring-2 ring-primary-200",
        )}
      >
        <span
          aria-hidden
          className={cn("absolute size-2 rotate-45 bg-white/95", TAIL_CLASS[node.labelSide])}
        />
        <span className="relative flex items-center gap-1.5">
          {node.step !== null && (
            <span
              className={cn(
                "grid size-[18px] shrink-0 place-items-center rounded-full text-[10px] font-bold",
                numberCls,
              )}
            >
              {node.step}
            </span>
          )}
          <span className="max-w-[112px] text-[12px] font-bold leading-tight text-ink">
            {node.title}
          </span>
          {node.state === "done" && (
            <span className="grid size-4 shrink-0 place-items-center rounded-full bg-mint-500 text-white">
              <Check className="size-2.5" strokeWidth={4} />
            </span>
          )}
        </span>
        {stateLine && (
          <span className={cn("relative mt-0.5 block", node.step !== null && "pl-6")}>
            {stateLine}
          </span>
        )}
      </span>
    </span>
  );
}
