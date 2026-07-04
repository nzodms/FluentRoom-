"use client";

import type { AvatarConfig } from "@/types/learning";
import { getAvatarItem } from "@/data/avatar-items";
import { cn } from "@/lib/utils";

/**
 * Personnage FluentRoom : 2D flat premium, 100 % SVG paramétrique.
 * Chaque emplacement (peau, cheveux, tenue, accessoire, aura, fond)
 * est piloté par un item du catalogue.
 */
export function AvatarCharacter({
  config,
  size = 96,
  className,
}: {
  config: AvatarConfig;
  size?: number;
  className?: string;
}) {
  const skin = getAvatarItem(config.skin)?.color ?? "#E2B08B";
  const hairItem = getAvatarItem(config.hair);
  const hair = hairItem?.color ?? "#4A3728";
  const hairStyle = config.hair;
  const outfit = getAvatarItem(config.outfit)?.color ?? "#585CE2";
  const accessory = getAvatarItem(config.accessory);
  const aura = getAvatarItem(config.aura)?.color;
  const background = getAvatarItem(config.background)?.color ?? "#F2F1EA";

  const isHoodie = config.outfit.includes("hoodie");

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={cn("shrink-0", className)}
      role="img"
      aria-label="Ton personnage FluentRoom"
    >
      <defs>
        <clipPath id="avatar-clip">
          <circle cx="60" cy="60" r="58" />
        </clipPath>
      </defs>

      {/* Fond */}
      <circle cx="60" cy="60" r="58" fill={background} />

      {/* Aura */}
      {aura && (
        <>
          <circle
            cx="60"
            cy="60"
            r="55"
            fill="none"
            stroke={aura}
            strokeWidth="4"
            opacity="0.55"
          />
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke={aura}
            strokeWidth="8"
            opacity="0.15"
          />
        </>
      )}

      <g clipPath="url(#avatar-clip)">
        {/* Épaules / tenue */}
        <path
          d="M22 120 C22 92 38 82 60 82 C82 82 98 92 98 120 Z"
          fill={outfit}
        />
        {/* Capuche */}
        {isHoodie && (
          <path
            d="M32 120 C32 98 44 90 60 90 C76 90 88 98 88 120"
            fill="none"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="3"
          />
        )}
        {/* Col */}
        <path d="M48 84 L60 94 L72 84 L72 92 L60 100 L48 92 Z" fill="rgba(0,0,0,0.12)" />

        {/* Cou */}
        <rect x="52" y="70" width="16" height="16" rx="7" fill={skin} />

        {/* Tête */}
        <circle cx="60" cy="52" r="26" fill={skin} />

        {/* Oreilles */}
        <circle cx="34.5" cy="53" r="4.5" fill={skin} />
        <circle cx="85.5" cy="53" r="4.5" fill={skin} />

        {/* Cheveux */}
        {hairStyle.startsWith("hair-short") && (
          <path
            d="M34 52 C34 34 45 25 60 25 C75 25 86 34 86 52 C86 46 80 40 74 40 C70 36 50 36 46 40 C40 40 34 46 34 52 Z"
            fill={hair}
          />
        )}
        {hairStyle === "hair-long" && (
          <path
            d="M32 78 C30 40 42 24 60 24 C78 24 90 40 88 78 C84 70 84 56 82 48 C78 40 70 37 60 37 C50 37 42 40 38 48 C36 56 36 70 32 78 Z"
            fill={hair}
          />
        )}
        {hairStyle === "hair-curly" && (
          <g fill={hair}>
            <circle cx="44" cy="34" r="10" />
            <circle cx="60" cy="28" r="11" />
            <circle cx="76" cy="34" r="10" />
            <circle cx="36" cy="46" r="7" />
            <circle cx="84" cy="46" r="7" />
            <path d="M36 46 C40 32 50 26 60 26 C70 26 80 32 84 46 C76 38 66 36 60 36 C54 36 44 38 36 46 Z" />
          </g>
        )}
        {hairStyle === "hair-bun" && (
          <g fill={hair}>
            <circle cx="60" cy="20" r="9" />
            <path d="M35 52 C35 34 46 26 60 26 C74 26 85 34 85 52 C81 44 74 39 60 39 C46 39 39 44 35 52 Z" />
          </g>
        )}

        {/* Yeux */}
        <circle cx="50" cy="53" r="2.8" fill="#2B2E3A" />
        <circle cx="70" cy="53" r="2.8" fill="#2B2E3A" />
        {/* Sourire */}
        <path
          d="M52 63 C55 67 65 67 68 63"
          fill="none"
          stroke="#2B2E3A"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        {/* Joues */}
        <circle cx="44" cy="60" r="3" fill="rgba(249,113,74,0.25)" />
        <circle cx="76" cy="60" r="3" fill="rgba(249,113,74,0.25)" />

        {/* Accessoires */}
        {accessory?.id === "acc-glasses" && (
          <g stroke={accessory.color ?? "#2B2E3A"} strokeWidth="2.4" fill="none">
            <circle cx="50" cy="53" r="7.5" />
            <circle cx="70" cy="53" r="7.5" />
            <path d="M57.5 53 L62.5 53" />
            <path d="M42.5 52 L36 50" />
            <path d="M77.5 52 L84 50" />
          </g>
        )}
        {accessory?.id === "acc-headphones" && (
          <g>
            <path
              d="M34 50 C34 30 46 22 60 22 C74 22 86 30 86 50"
              fill="none"
              stroke={accessory.color ?? "#585CE2"}
              strokeWidth="5"
              strokeLinecap="round"
            />
            <rect x="29" y="46" width="9" height="16" rx="4.5" fill={accessory.color ?? "#585CE2"} />
            <rect x="82" y="46" width="9" height="16" rx="4.5" fill={accessory.color ?? "#585CE2"} />
          </g>
        )}
        {accessory?.id === "acc-cap" && (
          <g fill={accessory.color ?? "#F9714A"}>
            <path d="M35 44 C35 30 46 23 60 23 C74 23 85 30 85 44 L35 44 Z" />
            <path d="M83 41 L98 44 C99 46 98 48 96 48 L83 46 Z" />
          </g>
        )}
      </g>
    </svg>
  );
}
