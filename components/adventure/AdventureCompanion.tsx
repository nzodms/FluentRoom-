"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { UserProgress } from "@/types/learning";
import type { AdventureProgress } from "@/lib/adventure/types";
import { companionLook } from "@/lib/companion";
import { CompanionCharacter } from "@/components/companion/CompanionCharacter";
import { loadJSON, saveJSON } from "@/lib/storage";

/**
 * Le compagnon sur la map : posé sur un anneau lumineux au node en
 * cours, avec ses accessoires débloqués et une idle douce. Quand un
 * chapitre vient d'être terminé, il voyage de l'ancien node au
 * nouveau (transform uniquement — le chemin s'illumine derrière lui
 * car les états des segments sont déjà recalculés).
 */
export function AdventureCompanion({
  adventure,
  progress,
}: {
  adventure: AdventureProgress;
  progress: UserProgress;
}) {
  const currentId = adventure.currentNodeId;
  const nodesById = new Map(adventure.nodes.map((n) => [n.id, n]));
  const storageKey = `adventure-pos:${adventure.zone.id}`;

  // Node de départ du voyage : la dernière position connue si elle diffère.
  const [fromId] = useState<string | null>(() => {
    const stored = loadJSON<string | null>(storageKey, null);
    return stored && stored !== currentId && nodesById.has(stored) ? stored : null;
  });

  useEffect(() => {
    if (currentId) saveJSON(storageKey, currentId);
  }, [currentId, storageKey]);

  if (!currentId) return null;
  const target = nodesById.get(currentId);
  if (!target) return null;
  const origin = fromId ? nodesById.get(fromId) : null;

  const look = companionLook(progress);
  // Nox se tient juste à côté de la balise du chapitre en cours,
  // sur le chemin — la balise reste visible.
  // Nox est posé SUR le socle lumineux du chapitre en cours.
  const pos = (n: { x: number; y: number }) => ({
    x: `${n.x}%`,
    y: `${n.y}%`,
  });

  return (
    <motion.div
      aria-hidden
      data-testid="adventure-companion"
      className="pointer-events-none absolute left-0 top-0 z-20 h-full w-full"
      initial={pos(origin ?? target)}
      animate={pos(target)}
      transition={
        origin
          ? { delay: 0.7, duration: 1.5, ease: [0.4, 0, 0.2, 1] }
          : { duration: 0 }
      }
    >
      <div className="absolute left-0 top-0 -translate-x-1/2 -translate-y-[88%]">
        {/* Idle : léger flottement au-dessus du socle */}
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <CompanionCharacter
            companionId={progress.companion}
            size={80}
            expression="happy"
            accessories={look.accessories}
            streakBadge={progress.streak >= 3 ? progress.streak : null}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
