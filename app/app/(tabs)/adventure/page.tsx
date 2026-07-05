"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import type { AdventureNodeView } from "@/lib/adventure/types";
import { GARE_DE_LONDRES } from "@/lib/adventure/data";
import { zoneProgress } from "@/lib/adventure/progression";
import { useProgress } from "@/lib/useProgress";
import { AdventureHeader } from "@/components/adventure/AdventureHeader";
import { AdventureMap } from "@/components/adventure/AdventureMap";
import { AdventureBottomSheet } from "@/components/adventure/AdventureBottomSheet";
import { RewardRoom } from "@/components/rewards/RewardRoom";

/**
 * L'Aventure : une scène immersive plein écran. La map illustrée
 * remplit l'écran, le header et la fiche flottent par-dessus,
 * la bottom nav reste en dessous. Tous les états sont dérivés
 * de la progression réelle.
 */
export default function AdventurePage() {
  const router = useRouter();
  const { progress, ready, openBonusChest } = useProgress();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [chestNode, setChestNode] = useState<AdventureNodeView | null>(null);

  const adventure = useMemo(
    () => zoneProgress(GARE_DE_LONDRES, progress),
    [progress],
  );

  if (!ready) return <div aria-hidden className="min-h-[60vh]" />;

  const selected =
    adventure.nodes.find((n) => n.id === (selectedId ?? adventure.currentNodeId)) ??
    adventure.nodes[0];

  const onPrimary = (node: AdventureNodeView) => {
    if (node.type === "chest" && node.state === "reward") {
      setChestNode(node);
      return;
    }
    if (node.type === "challenge" && node.href) {
      router.push(node.href);
      return;
    }
    if (node.chapter && node.state !== "locked") {
      router.push(`/app/chapter/${node.chapter.chapterId}`);
    }
  };

  return (
    <div className="relative mx-auto h-[calc(100dvh-4.5rem-env(safe-area-inset-bottom))] max-w-xl overflow-hidden md:h-[calc(100dvh-12rem)] md:overflow-hidden md:rounded-[2rem] md:border md:border-ink/5 md:shadow-soft">
      {/* La scène remplit tout l'écran derrière l'UI */}
      <AdventureMap
        adventure={adventure}
        progress={progress}
        selectedId={selected?.id ?? null}
        onSelect={setSelectedId}
      />

      {/* Header flottant, fondu doux vers la scène */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 bg-gradient-to-b from-cream via-cream/75 to-transparent px-4 pb-10 pt-[max(env(safe-area-inset-top),0.9rem)]">
        <div className="pointer-events-auto">
          <AdventureHeader adventure={adventure} progress={progress} />
        </div>
      </div>

      {/* Fiche flottante au-dessus de la bottom nav */}
      <div className="absolute inset-x-0 bottom-0 z-30 px-3 pb-3">
        {selected && (
          <AdventureBottomSheet node={selected} onPrimary={onPrimary} />
        )}
      </div>

      {/* Le coffre bonus s'ouvre sur place, dans la Reward Room */}
      <AnimatePresence>
        {chestNode && (
          <RewardRoom
            chestType="rare"
            avatar={progress.avatar}
            onOpen={() => openBonusChest(chestNode.id)}
            onCollect={() => setChestNode(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
