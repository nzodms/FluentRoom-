"use client";

import { motion } from "framer-motion";
import { Check, Clock3, Flame, Lock } from "lucide-react";
import type { AdventureNodeView } from "@/lib/adventure/types";
import { cn } from "@/lib/utils";

/**
 * Hiérarchie visuelle stricte :
 * — niveau 1 : le chapitre actif (grande balise, grande bulle) ;
 * — niveau 2 : terminés, coffre, défi (socles moyens, pills compactes) ;
 * — niveau 3 : verrouillés (petits, gris, discrets).
 * Les socles vivent dans la scène (z-10), les bulles dans une couche
 * au-dessus de tout (z-30) — jamais un socle devant un texte.
 */

export function AdventureNode({
  node,
  selected,
  onSelect,
  flat = false,
}: {
  node: AdventureNodeView;
  selected: boolean;
  onSelect: (id: string) => void;
  /** Scène illustrée : les socles sont peints, on n'affiche que les états. */
  flat?: boolean;
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
        <NodeMarker node={node} selected={selected} flat={flat} />
      </motion.button>
    </div>
  );
}

/** Bulle-label, couche haute : cliquable, ancrée sur son node. */
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
  if (node.type === "chest") return { w: 68, h: 56 };
  if (node.type === "challenge") return { w: 52, h: 48 };
  if (node.state === "done") return { w: 52, h: 42 };
  if (node.state === "current") return { w: 96, h: 74 };
  return { w: 42, h: 36 };
}

/* ---------- Marqueurs posés dans la scène ---------- */

function NodeMarker({
  node,
  selected,
  flat,
}: {
  node: AdventureNodeView;
  selected: boolean;
  flat: boolean;
}) {
  if (node.type === "chest") return <ChestMarker node={node} selected={selected} flat={flat} />;
  if (node.type === "challenge") return <ChallengeMarker selected={selected} flat={flat} />;
  if (node.state === "done") return <DonePedestal selected={selected} flat={flat} />;
  if (node.state === "current") return <CurrentBeacon selected={selected} flat={flat} />;
  return <LockedDisc selected={selected} />;
}

/** Socle vert compact : étape terminée (niveau 2). */
function DonePedestal({ selected, flat }: { selected: boolean; flat: boolean }) {
  return (
    <span className="relative grid h-[42px] w-[52px] place-items-center">
      {!flat && (
      <svg viewBox="0 0 52 42" className="absolute inset-0" aria-hidden>
        <ellipse cx="26" cy="32" rx="23" ry="8.5" fill="#2cb783" opacity="0.22" />
        <ellipse cx="26" cy="30.5" rx="18" ry="6.5" fill="#43cb95" opacity="0.5" />
        <ellipse cx="26" cy="29" rx="13.5" ry="4.8" fill="#d2f1e3" />
        <ellipse cx="26" cy="28" rx="13.5" ry="4.8" fill="#eafcf4" />
      </svg>
      )}
      <span
        className={cn(
          "relative -top-1.5 grid size-7 place-items-center rounded-full bg-white text-mint-500 shadow-soft ring-2 ring-mint-400",
          selected && "ring-[3px] ring-mint-500",
        )}
      >
        <Check className="size-3.5" strokeWidth={3.6} />
      </span>
    </span>
  );
}

/** Balise violette : LE point focal de la map (niveau 1). */
function CurrentBeacon({ selected, flat }: { selected: boolean; flat: boolean }) {
  return (
    <span className="relative grid h-[74px] w-[96px] place-items-center">
      {/* Double halo pulsant, bien plus fort que tout le reste */}
      <motion.span
        aria-hidden
        className="absolute left-1/2 top-1/2 size-[104px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-400/20"
        animate={{ scale: [1, 1.18, 1], opacity: [0.9, 0.45, 0.9] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.span
        aria-hidden
        className="absolute left-1/2 top-1/2 size-[76px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary-300/70"
        animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0, 0.8] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
      />
      {!flat && (
      <svg viewBox="0 0 96 74" className="absolute inset-0" aria-hidden>
        <ellipse cx="48" cy="58" rx="44" ry="14.5" fill="#585ce2" opacity="0.32" />
        <ellipse cx="48" cy="55" rx="35" ry="12" fill="#7679e9" opacity="0.75" />
        <ellipse cx="48" cy="51.5" rx="27" ry="9.5" fill="#c3c4f6" />
        <ellipse cx="48" cy="49" rx="27" ry="9.5" fill="#dfdffb" />
        <ellipse cx="48" cy="47.5" rx="17" ry="6" fill="#f4f4ff" />
      </svg>
      )}
      {!flat && (
      <span
        className={cn(
          "relative -top-3 grid size-10 place-items-center rounded-full gradient-primary shadow-glow",
          selected && "ring-4 ring-primary-200",
        )}
      >
        <svg viewBox="0 0 20 20" className="size-[18px] text-white" aria-hidden>
          <path
            d="M10 1.5 L12.2 7 L18 7.6 L13.6 11.4 L15 17.4 L10 14.2 L5 17.4 L6.4 11.4 L2 7.6 L7.8 7 Z"
            fill="currentColor"
          />
        </svg>
      </span>
      )}
    </span>
  );
}

/** Cadenas discret : étape verrouillée (niveau 3). */
function LockedDisc({ selected }: { selected: boolean }) {
  return (
    <span className="relative grid h-[36px] w-[42px] place-items-center">
      <svg viewBox="0 0 42 36" className="absolute inset-0" aria-hidden>
        <ellipse cx="21" cy="30" rx="14" ry="4.5" fill="#3a2c14" opacity="0.1" />
      </svg>
      <span
        className={cn(
          "relative -top-0.5 grid size-7 place-items-center rounded-full bg-[#8b90a3]/90 text-white/90 shadow-soft ring-2 ring-white/70",
          selected && "ring-[3px] ring-primary-200",
        )}
      >
        <Lock className="size-3" strokeWidth={2.4} />
      </span>
    </span>
  );
}

/** Coffre doré posé sur le chemin (niveau 2). */
function ChestMarker({
  node,
  selected,
  flat,
}: {
  node: AdventureNodeView;
  selected: boolean;
  flat: boolean;
}) {
  const open = node.state === "done";
  const locked = node.state === "locked";
  if (flat) {
    return (
      <span className="relative grid h-[56px] w-[68px] place-items-center">
        {node.state === "reward" && (
          <motion.span
            aria-hidden
            className="absolute left-1/2 top-1/2 size-[72px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-400/35"
            animate={{ scale: [1, 1.15, 1], opacity: [0.75, 0.4, 0.75] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
        {locked && (
          <span className="relative grid size-7 place-items-center rounded-full bg-[#8b90a3]/90 text-white/90 shadow-soft ring-2 ring-white/70">
            <Lock className="size-3" strokeWidth={2.4} />
          </span>
        )}
        {open && (
          <span className="relative grid size-7 place-items-center rounded-full bg-white text-mint-500 shadow-soft ring-2 ring-mint-400">
            <Check className="size-3.5" strokeWidth={3.6} />
          </span>
        )}
        {selected && (
          <span aria-hidden className="absolute inset-1 rounded-3xl ring-2 ring-gold-400/80" />
        )}
      </span>
    );
  }
  return (
    <span className="relative grid h-[56px] w-[68px] place-items-center">
      {node.state === "reward" && (
        <motion.span
          aria-hidden
          className="absolute left-1/2 top-1/2 size-[68px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-400/30"
          animate={{ scale: [1, 1.15, 1], opacity: [0.75, 0.4, 0.75] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <svg
        viewBox="0 0 76 62"
        className={cn(
          "relative h-[56px] w-[68px]",
          locked && "opacity-55 grayscale",
          selected && "drop-shadow-lg",
        )}
        aria-hidden
      >
        <ellipse cx="38" cy="52" rx="24" ry="7" fill="#3a2c14" opacity="0.18" />
        {!locked && <ellipse cx="38" cy="50" rx="28" ry="9" fill="#ffd76e" opacity="0.45" />}
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

/** Pastille défi : flamme corail, compacte (niveau 2). */
function ChallengeMarker({ selected, flat }: { selected: boolean; flat: boolean }) {
  if (flat) {
    return (
      <span className="relative grid h-[48px] w-[52px] place-items-center">
        {selected && (
          <span aria-hidden className="absolute inset-0 rounded-full ring-[3px] ring-coral-100" />
        )}
      </span>
    );
  }
  return (
    <span className="relative grid h-[48px] w-[52px] place-items-center">
      <svg viewBox="0 0 52 48" className="absolute inset-0" aria-hidden>
        <ellipse cx="26" cy="40" rx="16" ry="5" fill="#3a2c14" opacity="0.13" />
      </svg>
      <span
        className={cn(
          "relative -top-1 grid size-10 place-items-center rounded-full bg-white shadow-lift",
          selected && "ring-[3px] ring-coral-100",
        )}
      >
        <span className="grid size-[30px] place-items-center rounded-full gradient-coral text-white">
          <Flame className="size-4" fill="currentColor" />
        </span>
      </span>
    </span>
  );
}

/* ---------- Bulles-labels, par niveau de hiérarchie ---------- */

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
  const side = cn("absolute z-10 block w-max text-left", SIDE_CLASS[node.labelSide]);

  /* Niveau 1 — chapitre actif : la seule grande bulle de la map. */
  if (node.state === "current") {
    return (
      <span className={side}>
        <span
          className={cn(
            "relative block rounded-2xl border-2 border-primary-200 bg-white px-2.5 py-2 shadow-lift",
            selected && "border-primary-300",
          )}
        >
          <span
            aria-hidden
            className={cn(
              "absolute size-2.5 rotate-45 border-primary-200 bg-white",
              TAIL_CLASS[node.labelSide],
            )}
          />
          <span className="relative flex items-center gap-2">
            <span className="grid size-[18px] shrink-0 place-items-center rounded-full bg-primary-500 text-[10px] font-bold text-white">
              {node.step}
            </span>
            <span className="max-w-[96px] text-[12px] font-bold leading-tight text-ink">
              {node.title}
            </span>
          </span>
          <span className="relative mt-0.5 flex items-center gap-1 pl-[26px] text-[10px] font-bold text-primary-600">
            <Clock3 className="size-3" /> En cours
          </span>
        </span>
      </span>
    );
  }

  /* Niveau 2 — terminé : pill compacte, check + titre. */
  if (node.state === "done") {
    return (
      <span className={side}>
        <span
          className={cn(
            "relative flex items-center gap-1.5 rounded-full bg-white/95 py-1 pl-1 pr-2.5 shadow-soft backdrop-blur-sm",
            selected && "ring-2 ring-mint-400",
          )}
        >
          <span className="grid size-4 shrink-0 place-items-center rounded-full bg-mint-500 text-white">
            <Check className="size-2.5" strokeWidth={4} />
          </span>
          <span className="max-w-[110px] truncate text-[10px] font-bold text-ink-soft">
            {node.title}
          </span>
        </span>
      </span>
    );
  }

  /* Niveau 2 — coffre : pill concise, dorée quand disponible. */
  if (node.type === "chest") {
    const ready = node.state === "reward";
    return (
      <span className={side}>
        <span
          className={cn(
            "relative flex items-center gap-1.5 rounded-full py-1 pl-2 pr-2.5 shadow-soft backdrop-blur-sm",
            ready ? "bg-white/95" : "bg-white/80",
            selected && "ring-2 ring-gold-400",
          )}
        >
          <span
            className={cn(
              "size-2 shrink-0 rounded-full",
              ready ? "bg-gold-400" : "bg-ink/20",
            )}
          />
          <span
            className={cn(
              "text-[10px] font-bold",
              ready ? "text-ink" : "text-ink-faint",
            )}
          >
            {node.title}
          </span>
          {ready && (
            <span className="text-[10px] font-bold text-gold-500">Récompense</span>
          )}
        </span>
      </span>
    );
  }

  /* Niveau 2 — défi express : pill corail, une ligne. */
  if (node.type === "challenge") {
    return (
      <span className={side}>
        <span
          className={cn(
            "relative flex items-center gap-1.5 rounded-full bg-white/95 py-1 pl-2 pr-2.5 shadow-soft backdrop-blur-sm",
            selected && "ring-2 ring-coral-100",
          )}
        >
          <Flame className="size-3 shrink-0 text-coral-500" fill="currentColor" />
          <span className="text-[10px] font-bold text-ink">{node.title}</span>
          {node.meta.durationMin && node.meta.rewardFP && (
            <span className="text-[10px] font-bold text-coral-500">
              {node.meta.durationMin} min · +{node.meta.rewardFP} FP
            </span>
          )}
        </span>
      </span>
    );
  }

  /* Niveau 3 — verrouillé : pill discrète, grisée, minimale. */
  return (
    <span className={side}>
      <span
        className={cn(
          "relative flex items-center gap-1 rounded-full bg-white/70 px-2 py-[3px] backdrop-blur-sm",
          selected && "ring-2 ring-primary-200 bg-white/90",
        )}
      >
        <Lock className="size-2.5 shrink-0 text-ink-faint/80" />
        <span className="max-w-[124px] truncate text-[10px] font-semibold text-ink-faint">
          {node.title}
        </span>
      </span>
    </span>
  );
}
