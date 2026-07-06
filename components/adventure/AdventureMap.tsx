"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { UserProgress } from "@/types/learning";
import type { AdventureProgress } from "@/lib/adventure/types";
import { AdventureZoneBackdrop } from "./AdventureZoneBackdrop";
import { AdventureMapBackground } from "./AdventureMapBackground";
import { AdventurePath, type PathSegment } from "./AdventurePath";
import { AdventureNode, AdventureNodeLabel } from "./AdventureNode";
import { AdventureCompanion } from "./AdventureCompanion";

/**
 * La scène : illustration premium plein cadre (ou décor SVG de
 * secours), chemin dynamique, nodes, compagnon. Les coordonnées des
 * nodes sont en % de l'IMAGE : une boîte de scène au ratio de
 * l'illustration couvre le conteneur (façon object-cover), et tout
 * est positionné dedans — l'alignement sur le décor est exact sur
 * tous les écrans.
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
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const image = adventure.zone.theme.image;
  const flat = Boolean(image);
  const ratio = image ? image.width / image.height : 390 / 720;

  // Boîte de scène. Avec une illustration : pleine largeur, ancrée en
  // haut (comme la maquette) — le bas flouté disparaît derrière la
  // fiche. Sans image : cover centré classique.
  let sceneW = size.w;
  let sceneH = size.h;
  let sceneLeft = 0;
  let sceneTop = 0;
  if (size.w > 0 && size.h > 0) {
    if (image) {
      // Pleine largeur, calée sous le header — le haut de l'illustration
      // (verrière, horloge) respire derrière le fondu du header.
      sceneW = size.w;
      sceneH = size.w / ratio;
      sceneTop = size.h * 0.155;
    } else if (size.w / size.h > ratio) {
      sceneW = size.w;
      sceneH = size.w / ratio;
      sceneTop = (size.h - sceneH) / 2;
    } else {
      sceneH = size.h;
      sceneW = size.h * ratio;
      sceneLeft = (size.w - sceneW) / 2;
    }
  }

  const byId = new Map(adventure.nodes.map((n) => [n.id, n]));
  const current = adventure.currentNodeId
    ? byId.get(adventure.currentNodeId)
    : null;
  const px = (id: string) => {
    const n = byId.get(id);
    return n
      ? { x: (n.x / 100) * sceneW, y: (n.y / 100) * sceneH }
      : { x: 0, y: 0 };
  };

  const bakedKey = new Set(
    (adventure.zone.bakedPath ?? []).map(([a, b]) => `${a}|${b}`),
  );
  const isBaked = (a: string, b: string) =>
    bakedKey.has(`${a}|${b}`) || bakedKey.has(`${b}|${a}`);

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
    // Les segments peints dans l'illustration ne sont pas redessinés.
    if (flat && isBaked(id, nextId)) return;
    segments.push({
      id: `${id}-${nextId}`,
      from: px(id),
      to: px(nextId),
      state,
      bend: i % 2 === 0 ? 1 : -1,
    });
  });
  adventure.zone.spurs.forEach(([fromId, toId], i) => {
    const to = byId.get(toId);
    if (!byId.get(fromId) || !to) return;
    if (flat && isBaked(fromId, toId)) return;
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
      {/* Boîte de scène : tout est positionné en % de l'illustration */}
      <div
        className="absolute"
        style={{ width: sceneW, height: sceneH, left: sceneLeft, top: sceneTop }}
      >
        {image ? (
          <AdventureMapBackground image={image} />
        ) : (
          <AdventureZoneBackdrop theme={adventure.zone.theme.id} />
        )}

        {/* Voile de focalisation doux autour du chapitre actif */}
        {current && (
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background: flat
                ? `radial-gradient(circle at ${current.x}% ${current.y}%, transparent 22%, rgba(247,246,241,0.1) 55%, rgba(247,246,241,0.3) 100%)`
                : `radial-gradient(circle at ${current.x}% ${current.y}%, transparent 16%, rgba(247,246,241,0.22) 55%, rgba(247,246,241,0.5) 100%)`,
            }}
          />
        )}

        <AdventurePath
          width={sceneW}
          height={sceneH}
          segments={segments}
          imageScene={flat}
        />
        {/* Couches : socles (z-10) → compagnon (z-20) → bulles (z-30) */}
        {adventure.nodes.map((node) => (
          <AdventureNode
            key={node.id}
            node={node}
            selected={selectedId === node.id}
            onSelect={onSelect}
            flat={flat}
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
      </div>
    </motion.div>
  );
}
