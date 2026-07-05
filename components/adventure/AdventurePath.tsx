"use client";

import { motion } from "framer-motion";

/**
 * Le chemin de la zone, intégré au sol de la scène : un ruban doré
 * lumineux sur la partie parcourue/active, de gros pointillés gris
 * arrondis sur la suite verrouillée — comme sur la maquette validée.
 * Coordonnées en pixels (fournies par la map, qui mesure son conteneur).
 */

export type PathSegmentState = "done" | "active" | "locked";

export interface PathSegment {
  id: string;
  from: { x: number; y: number };
  to: { x: number; y: number };
  state: PathSegmentState;
  /** Sens de la courbe (alterné pour serpenter naturellement). */
  bend: 1 | -1;
}

function segmentD(seg: PathSegment): string {
  const { from, to, bend } = seg;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.max(Math.hypot(dx, dy), 1);
  // Perpendiculaire normalisée : la courbe s'écarte doucement du trait droit.
  const px = (-dy / len) * Math.min(len * 0.24, 40) * bend;
  const py = (dx / len) * Math.min(len * 0.24, 40) * bend;
  const c1x = from.x + dx * 0.3 + px;
  const c1y = from.y + dy * 0.3 + py;
  const c2x = from.x + dx * 0.7 + px;
  const c2y = from.y + dy * 0.7 + py;
  return `M ${from.x} ${from.y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${to.x} ${to.y}`;
}

export function AdventurePath({
  width,
  height,
  segments,
}: {
  width: number;
  height: number;
  segments: PathSegment[];
}) {
  if (width === 0 || height === 0) return null;

  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${width} ${height}`}
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      <defs>
        <linearGradient id="adv-path-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffe9a8" />
          <stop offset="0.5" stopColor="#ffd76e" />
          <stop offset="1" stopColor="#ffe9a8" />
        </linearGradient>
      </defs>

      {segments.map((seg) => {
        const d = segmentD(seg);
        if (seg.state === "locked") {
          return (
            <g key={seg.id}>
              {/* Ombre douce sous les pointillés */}
              <path
                d={d}
                fill="none"
                stroke="#3a2c14"
                strokeWidth={8}
                strokeLinecap="round"
                strokeDasharray="12 17"
                opacity={0.07}
                transform="translate(0 2)"
              />
              <path
                d={d}
                fill="none"
                stroke="#c9ccd6"
                strokeWidth={7}
                strokeLinecap="round"
                strokeDasharray="12 17"
                opacity={0.85}
              />
            </g>
          );
        }
        return (
          <g key={seg.id}>
            {/* Halo doré diffus */}
            <motion.path
              d={d}
              fill="none"
              stroke="#ffce5c"
              strokeWidth={26}
              strokeLinecap="round"
              initial={{ opacity: 0.22 }}
              animate={
                seg.state === "active"
                  ? { opacity: [0.22, 0.4, 0.22] }
                  : { opacity: 0.22 }
              }
              transition={
                seg.state === "active"
                  ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
                  : undefined
              }
            />
            {/* Ruban lumineux */}
            <path
              d={d}
              fill="none"
              stroke="url(#adv-path-gold)"
              strokeWidth={13}
              strokeLinecap="round"
            />
            {/* Cœur clair du ruban */}
            <path
              d={d}
              fill="none"
              stroke="#fff7dd"
              strokeWidth={5.5}
              strokeLinecap="round"
              opacity={0.95}
            />
          </g>
        );
      })}
    </svg>
  );
}
