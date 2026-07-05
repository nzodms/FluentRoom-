"use client";

import { motion } from "framer-motion";
import { CHEST_STYLES, type ChestVariant } from "@/data/chest-variants";

export type ChestState = "idle" | "tap1" | "tap2" | "opening" | "opened";

interface IllustratedChestProps {
  state: ChestState;
  variant?: ChestVariant;
  size?: number;
  className?: string;
}

/**
 * Le coffre FluentRoom : illustration 2D en couches SVG —
 * corps, couvercle articulé, ferrures, serrure, faisceau de lumière,
 * étincelles. Chaque état a sa mise en scène.
 */
export function IllustratedChest({
  state,
  variant = "daily",
  size = 220,
  className,
}: IllustratedChestProps) {
  const style = CHEST_STYLES[variant];
  const open = state === "opening" || state === "opened";
  const litSeam = state === "tap2" || open;

  return (
    <motion.svg
      key={state === "tap1" ? "tap1" : "chest"}
      width={size * style.scale}
      height={size * style.scale * 0.95}
      viewBox="0 0 200 190"
      className={className}
      // Bounce au tap 1, tremblement au tap 2, respiration au repos.
      animate={
        state === "tap1"
          ? { y: [0, -16, 0, -6, 0], rotate: [0, -1.5, 1.5, 0] }
          : state === "tap2"
            ? { x: [0, -3, 3, -3, 3, 0] }
            : state === "idle"
              ? { scale: [1, 1.015, 1] }
              : { y: 0 }
      }
      transition={
        state === "tap1"
          ? { duration: 0.55, ease: "easeOut" }
          : state === "tap2"
            ? { duration: 0.4, repeat: Infinity, repeatDelay: 0.5 }
            : state === "idle"
              ? { duration: 3, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0.3 }
      }
    >
      <defs>
        <linearGradient id="chest-beam" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor={style.glow} stopOpacity="0.9" />
          <stop offset="100%" stopColor={style.glow} stopOpacity="0" />
        </linearGradient>
        <radialGradient id="chest-inner" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="100%" stopColor={style.glow} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ombre au sol */}
      <motion.ellipse
        cx="100"
        cy="176"
        rx="62"
        ry="10"
        fill="rgba(23,26,38,0.18)"
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        animate={open ? { scaleX: 1.13, opacity: 0.25 } : { scaleX: 1, opacity: 1 }}
      />

      {/* Faisceau de lumière (ouverture) */}
      <motion.polygon
        points="66,88 134,88 158,-8 42,-8"
        fill="url(#chest-beam)"
        initial={{ opacity: 0 }}
        animate={
          open
            ? { opacity: state === "opened" ? [0.85, 0.6, 0.85] : 0.9, scaleY: 1 }
            : { opacity: 0, scaleY: 0.3 }
        }
        transition={
          state === "opened"
            ? { duration: 2.2, repeat: Infinity }
            : { duration: 0.5 }
        }
        style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
      />

      {/* Lueur interne visible à l'ouverture */}
      <motion.ellipse
        cx="100"
        cy="88"
        rx="52"
        ry="16"
        fill="url(#chest-inner)"
        initial={{ opacity: 0 }}
        animate={{ opacity: open ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      />

      {/* Couvercle articulé (charnière arrière gauche) */}
      <motion.g
        style={{ transformBox: "fill-box", transformOrigin: "12% 92%" }}
        animate={
          open
            ? { rotate: -38, y: -10, x: -4 }
            : { rotate: 0, y: 0, x: 0 }
        }
        transition={{ type: "spring", stiffness: 160, damping: 16 }}
      >
        {/* Dôme */}
        <path
          d="M33 88 L33 66 Q33 30 100 30 Q167 30 167 66 L167 88 Z"
          fill={style.lid}
        />
        {/* Ombre interne bas du couvercle */}
        <rect x="33" y="80" width="134" height="8" fill={style.lidDark} />
        {/* Reflet */}
        <path
          d="M45 62 Q48 42 78 36"
          fill="none"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* Bandes métalliques du couvercle */}
        <rect x="56" y="33" width="13" height="55" rx="4" fill={style.metal} />
        <rect x="131" y="33" width="13" height="55" rx="4" fill={style.metal} />
        <rect x="56" y="33" width="4" height="55" fill="rgba(255,255,255,0.35)" />
        <rect x="131" y="33" width="4" height="55" fill="rgba(255,255,255,0.35)" />
      </motion.g>

      {/* Corps du coffre */}
      <g>
        <rect x="35" y="88" width="130" height="72" rx="12" fill={style.base} />
        {/* Panneaux */}
        <line x1="72" y1="92" x2="72" y2="156" stroke={style.baseDark} strokeWidth="2" opacity="0.5" />
        <line x1="128" y1="92" x2="128" y2="156" stroke={style.baseDark} strokeWidth="2" opacity="0.5" />
        {/* Assise sombre */}
        <rect x="35" y="146" width="130" height="14" rx="10" fill={style.baseDark} />
        {/* Reflet gauche */}
        <rect x="41" y="94" width="6" height="48" rx="3" fill="rgba(255,255,255,0.22)" />
        {/* Bandes métalliques du corps */}
        <rect x="56" y="88" width="13" height="72" rx="4" fill={style.metal} />
        <rect x="131" y="88" width="13" height="72" rx="4" fill={style.metal} />
        <rect x="56" y="88" width="4" height="72" fill="rgba(255,255,255,0.3)" />
        <rect x="131" y="88" width="4" height="72" fill="rgba(255,255,255,0.3)" />
        {/* Rivets */}
        {[60.5, 135.5].map((x) =>
          [96, 148].map((y) => (
            <circle key={`${x}-${y}`} cx={x + 2} cy={y} r="2.2" fill={style.metalDark} />
          )),
        )}
      </g>

      {/* Trait de lumière entre couvercle et corps */}
      <motion.rect
        x="36"
        y="85.5"
        width="128"
        height="4"
        rx="2"
        fill="#FFFFFF"
        initial={{ opacity: 0 }}
        animate={litSeam ? { opacity: [0.4, 1, 0.4] } : { opacity: 0 }}
        transition={{ duration: 0.9, repeat: litSeam ? Infinity : 0 }}
      />

      {/* Serrure */}
      <motion.g
        style={{ transformBox: "fill-box", transformOrigin: "50% 30%" }}
        animate={
          state === "tap2"
            ? { rotate: [0, -8, 8, -8, 0] }
            : open
              ? { rotate: 24, y: 4, opacity: 0.85 }
              : { rotate: 0 }
        }
        transition={
          state === "tap2"
            ? { duration: 0.5, repeat: Infinity, repeatDelay: 0.4 }
            : { type: "spring", stiffness: 200, damping: 15 }
        }
      >
        <rect x="86" y="76" width="28" height="30" rx="7" fill={style.metal} />
        <rect x="86" y="76" width="28" height="30" rx="7" fill="none" stroke={style.metalDark} strokeWidth="2" />
        <circle cx="100" cy="87" r="4.5" fill={style.metalDark} />
        <path d="M97.5 90 L100 99 L102.5 90 Z" fill={style.metalDark} />
        <circle cx="95" cy="81" r="1.6" fill="rgba(255,255,255,0.6)" />
      </motion.g>

      {/* Étincelles quand ouvert */}
      {open &&
        [
          { x: 70, y: 70, d: 0 },
          { x: 100, y: 58, d: 0.4 },
          { x: 130, y: 72, d: 0.8 },
          { x: 85, y: 50, d: 1.2 },
          { x: 118, y: 44, d: 1.6 },
        ].map((sparkle, i) => (
          <motion.path
            key={i}
            d="M0 -5 L1.4 -1.4 L5 0 L1.4 1.4 L0 5 L-1.4 1.4 L-5 0 L-1.4 -1.4 Z"
            fill={style.glow}
            initial={{ opacity: 0, x: sparkle.x, y: sparkle.y + 20, scale: 0.4 }}
            animate={{
              opacity: [0, 1, 0],
              y: [sparkle.y + 16, sparkle.y - 34],
              scale: [0.4, 1, 0.5],
              rotate: [0, 90],
            }}
            transition={{
              duration: 1.8,
              delay: sparkle.d,
              repeat: Infinity,
              repeatDelay: 0.6,
            }}
          />
        ))}
    </motion.svg>
  );
}
