"use client";

import { Lock } from "lucide-react";
import type { Badge } from "@/types/learning";
import {
  LearningGlyph,
  type LearningIconName,
} from "@/components/icons/learning-icons";
import { cn } from "@/lib/utils";

/**
 * Médaillon de badge dessiné en SVG : anneau doré, ruban, emblème
 * repris des icônes pédagogiques. Verrouillé = version gris pierre.
 */

const BADGE_GLYPH: Record<string, LearningIconName> = {
  "first-room": "listen",
  "first-phrase": "phrase",
  "phrases-5": "review",
  "phrases-25": "chest",
  "first-speak-back": "speak",
  "first-shadowing": "shadowing",
  "streak-3": "streak",
  "streak-7": "streak",
  "fast-listener": "fast",
  "no-subtitles": "video",
  "natural-reply": "native",
  comeback: "quest",
  "first-lesson": "lesson",
  "first-mastered": "fluency",
};

export function badgeGlyphName(badgeId: string): LearningIconName {
  return BADGE_GLYPH[badgeId] ?? "quest";
}

export function BadgeMedallion({
  badge,
  earned,
  size = 72,
  className,
}: {
  badge: Badge;
  earned: boolean;
  size?: number;
  className?: string;
}) {
  const gradId = `medal-${badge.id}`;
  return (
    <div
      className={cn("relative inline-block", className)}
      style={{ width: size, height: (size * 120) / 100 }}
    >
      <svg
        viewBox="0 0 100 120"
        width={size}
        height={(size * 120) / 100}
        aria-hidden
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            {earned ? (
              <>
                <stop offset="0%" stopColor="#F3C64E" />
                <stop offset="55%" stopColor="#E0A32E" />
                <stop offset="100%" stopColor="#C4881F" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#D8D6D0" />
                <stop offset="100%" stopColor="#B8B6B0" />
              </>
            )}
          </linearGradient>
        </defs>

        {/* Ruban */}
        <polygon
          points="34,72 43,116 50,103 50,72"
          fill={earned ? "#585CE2" : "#C6C4BE"}
        />
        <polygon
          points="50,72 50,103 57,116 66,72"
          fill={earned ? "#4348C8" : "#B4B2AC"}
        />

        {/* Médaille */}
        <circle cx="50" cy="48" r="42" fill={`url(#${gradId})`} />
        <circle
          cx="50"
          cy="48"
          r="36.5"
          fill="none"
          stroke="rgba(255,255,255,0.45)"
          strokeWidth="1.6"
          strokeDasharray="2.5 4.5"
        />
        <circle
          cx="50"
          cy="48"
          r="32"
          fill={earned ? "#FFF7E2" : "#EFEEE9"}
        />
        {/* Reflet */}
        <ellipse
          cx="38"
          cy="30"
          rx="16"
          ry="9"
          fill="rgba(255,255,255,0.35)"
          transform="rotate(-24 38 30)"
        />
      </svg>

      {/* Emblème centré sur la médaille */}
      <span
        className="absolute left-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center"
        style={{ top: `${(48 / 120) * 100}%` }}
      >
        {earned ? (
          <LearningGlyph
            name={badgeGlyphName(badge.id)}
            className="text-gold-500"
            style={{ width: size * 0.34, height: size * 0.34 }}
          />
        ) : (
          <Lock
            className="text-ink-faint"
            style={{ width: size * 0.28, height: size * 0.28 }}
          />
        )}
      </span>
    </div>
  );
}
