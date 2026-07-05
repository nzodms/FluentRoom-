"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { UserProgress } from "@/types/learning";
import type { AdventureProgress } from "@/lib/adventure/types";
import { AdventureZoneBackdrop } from "./AdventureZoneBackdrop";
import { AdventurePath, type PathSegment } from "./AdventurePath";
import { AdventureNode, AdventureNodeLabel } from "./AdventureNode";
import { AdventureCompanion } from "./AdventureCompanion";

/**
 * La scène : décor illustré plein cadre, chemin intégré au sol,
 * nodes positionnés en % de la scène, compagnon sur le node actuel.
 * Le conteneur est mesuré pour tracer le chemin en pixels exacts.
 */
export function AdventureMap({
  adventure,
  progress,
  selectedId,
  onSelect,
}: {
  adventure: AdventureProgress;
  progress: UserProgress;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () =>
      setSize({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const byId = new Map(adventure.nodes.map((n) => [n.id, n]));
  const current = adventure.currentNodeId
    ? byId.get(adventure.currentNodeId)
    : null;
  const px = (id: string) => {
    const n = byId.get(id);
    return n
      ? { x: (n.x / 100) * size.w, y: (n.y / 100) * size.h }
      : { x: 0, y: 0 };
  };

  // Chemin principal : lumineux jusqu'au node en cours, pointillé après.
  const segments: PathSegment[] = [];
  adventure.zone.path.forEach((id, i) => {
    const nextId = adventure.zone.path[i + 1];
    if (!nextId) return;
    const from = byId.get(id);
    const to = byId.get(nextId);
    if (!from || !to) return;
    const state =
      from.state === "done" && to.state === "done"
        ? "done"
        : from.state === "done" && to.state === "current"
          ? "active"
          : "locked";
    segments.push({
      id: `${id}-${nextId}`,
      from: px(id),
      to: px(nextId),
      state,
      bend: i % 2 === 0 ? 1 : -1,
    });
  });
  // Embranchements courts vers le coffre et le défi.
  adventure.zone.spurs.forEach(([fromId, toId], i) => {
    const to = byId.get(toId);
    if (!byId.get(fromId) || !to) return;
    segments.push({
      id: `${fromId}-${toId}`,
      from: px(fromId),
      to: px(toId),
      state:
        to.state === "reward" || to.state === "available"
          ? "active"
          : to.state === "done"
            ? "done"
            : "locked",
      bend: i % 2 === 0 ? -1 : 1,
    });
  });

  return (
    <motion.div
      ref={ref}
      data-testid="adventure-map"
      initial={{ opacity: 0, scale: 0.985 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="absolute inset-0 overflow-hidden"
    >
      <AdventureZoneBackdrop theme={adventure.zone.theme.id} />
      {/* Voile de focalisation : le décor s'adoucit loin du chapitre
          actif — l'œil est guidé vers le cœur de la progression. */}
      {current && (
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at ${current.x}% ${current.y}%, transparent 16%, rgba(247,246,241,0.22) 55%, rgba(247,246,241,0.5) 100%)`,
          }}
        />
      )}
      <AdventurePath width={size.w} height={size.h} segments={segments} />
      {/* Couches : socles (z-10) → compagnon (z-20) → bulles (z-30) */}
      {adventure.nodes.map((node) => (
        <AdventureNode
          key={node.id}
          node={node}
          selected={selectedId === node.id}
          onSelect={onSelect}
        />
      ))}
      <AdventureCompanion adventure={adventure} progress={progress} />
      {adventure.nodes.map((node) => (
        <AdventureNodeLabel
          key={`label-${node.id}`}
          node={node}
          selected={selectedId === node.id}
          onSelect={onSelect}
        />
      ))}
    </motion.div>
  );
}
