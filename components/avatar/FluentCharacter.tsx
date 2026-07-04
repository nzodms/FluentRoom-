"use client";

import { motion } from "framer-motion";
import type { AvatarConfig } from "@/types/learning";
import { getAvatarItem } from "@/data/avatar-items";
import { cn } from "@/lib/utils";

export type CharacterExpression =
  | "neutral"
  | "happy"
  | "proud"
  | "excited"
  | "tired"
  | "focused"
  | "surprised"
  | "encouraging"
  | "celebrating";

type Pose = "normal" | "celebrate" | "tired";

const POSE_BY_EXPRESSION: Record<CharacterExpression, Pose> = {
  neutral: "normal",
  happy: "normal",
  proud: "normal",
  excited: "celebrate",
  tired: "tired",
  focused: "normal",
  surprised: "normal",
  encouraging: "normal",
  celebrating: "celebrate",
};

interface FluentCharacterProps {
  config: AvatarConfig;
  expression?: CharacterExpression;
  size?: number;
  /** Respiration + clignement des yeux. */
  animated?: boolean;
  /** Affiche le fond circulaire (désactivable pour les scènes). */
  showBackground?: boolean;
  className?: string;
}

/**
 * Le personnage FluentRoom : 2D vectoriel en calques
 * (ombre, aura, corps, bras, tête, cheveux, visage, accessoire),
 * expressions et postures. Premium, expressif, jamais bébé.
 */
export function FluentCharacter({
  config,
  expression = "neutral",
  size = 120,
  animated = true,
  showBackground = true,
  className,
}: FluentCharacterProps) {
  const skin = getAvatarItem(config.skin)?.color ?? "#E2B08B";
  const skinShade = "rgba(0,0,0,0.12)";
  const hairItem = getAvatarItem(config.hair);
  const hair = hairItem?.color ?? "#4A3728";
  const hairStyle = config.hair;
  const outfit = getAvatarItem(config.outfit)?.color ?? "#585CE2";
  const accessory = getAvatarItem(config.accessory);
  const aura = getAvatarItem(config.aura)?.color;
  const background = getAvatarItem(config.background)?.color ?? "#F2F1EA";
  const isHoodie = config.outfit.includes("hoodie");
  const pose = POSE_BY_EXPRESSION[expression];

  // Yeux : fermés-joyeux (arcs) pour celebrating/proud, mi-clos si tired.
  const eyesClosed = expression === "celebrating";
  const eyesHalf = expression === "tired";
  const eyesWide = expression === "surprised" || expression === "excited";

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={cn("shrink-0 overflow-visible", className)}
      role="img"
      aria-label="Ton personnage FluentRoom"
      animate={
        animated
          ? pose === "celebrate"
            ? { y: [0, -5, 0] }
            : pose === "tired"
              ? { y: [0, 2, 0], rotate: [0, -1, 0] }
              : { y: [0, -2, 0] }
          : undefined
      }
      transition={{
        duration: pose === "celebrate" ? 0.9 : 3.2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <defs>
        <clipPath id={`fc-clip-${size}`}>
          <circle cx="100" cy="100" r="96" />
        </clipPath>
      </defs>

      {/* Fond */}
      {showBackground && <circle cx="100" cy="100" r="96" fill={background} />}

      {/* Aura */}
      {aura && (
        <motion.g
          animate={animated ? { opacity: [0.6, 1, 0.6] } : undefined}
          transition={{ duration: 2.6, repeat: Infinity }}
        >
          <circle cx="100" cy="100" r="92" fill="none" stroke={aura} strokeWidth="4" opacity="0.5" />
          <circle cx="100" cy="100" r="85" fill="none" stroke={aura} strokeWidth="9" opacity="0.14" />
        </motion.g>
      )}

      <g clipPath={showBackground ? `url(#fc-clip-${size})` : undefined}>
        {/* Ombre sous le corps */}
        <ellipse cx="100" cy="192" rx="52" ry="9" fill="rgba(23,26,38,0.12)" />

        {/* Bras gauche */}
        <motion.g
          style={{ transformBox: "fill-box", transformOrigin: "80% 15%" }}
          animate={
            pose === "celebrate"
              ? { rotate: [-118, -128, -118] }
              : pose === "tired"
                ? { rotate: 8 }
                : { rotate: 0 }
          }
          transition={
            pose === "celebrate"
              ? { duration: 0.9, repeat: Infinity, ease: "easeInOut" }
              : { type: "spring", stiffness: 200, damping: 18 }
          }
        >
          <rect x="34" y="142" width="22" height="52" rx="11" fill={outfit} />
          <rect x="34" y="142" width="22" height="52" rx="11" fill="rgba(0,0,0,0.08)" />
          <circle cx="45" cy="192" r="9" fill={skin} />
        </motion.g>

        {/* Bras droit */}
        <motion.g
          style={{ transformBox: "fill-box", transformOrigin: "20% 15%" }}
          animate={
            pose === "celebrate"
              ? { rotate: [118, 128, 118] }
              : pose === "tired"
                ? { rotate: -8 }
                : { rotate: 0 }
          }
          transition={
            pose === "celebrate"
              ? { duration: 0.9, repeat: Infinity, ease: "easeInOut", delay: 0.05 }
              : { type: "spring", stiffness: 200, damping: 18 }
          }
        >
          <rect x="144" y="142" width="22" height="52" rx="11" fill={outfit} />
          <rect x="144" y="142" width="22" height="52" rx="11" fill="rgba(0,0,0,0.08)" />
          <circle cx="155" cy="192" r="9" fill={skin} />
        </motion.g>

        {/* Torse */}
        <path
          d="M42 200 C42 152 62 136 100 136 C138 136 158 152 158 200 Z"
          fill={outfit}
        />
        {/* Ombre du torse côté droit */}
        <path
          d="M118 140 C142 148 152 166 154 200 L158 200 C158 152 138 136 100 136 Z"
          fill="rgba(0,0,0,0.1)"
        />
        {/* Highlight torse */}
        <path
          d="M52 200 C52 164 62 148 78 142"
          fill="none"
          stroke="rgba(255,255,255,0.28)"
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* Capuche + cordons */}
        {isHoodie && (
          <>
            <path
              d="M58 200 C58 164 72 150 100 150 C128 150 142 164 142 200"
              fill="none"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="4"
            />
            <line x1="92" y1="152" x2="92" y2="172" stroke="rgba(255,255,255,0.5)" strokeWidth="3" strokeLinecap="round" />
            <line x1="108" y1="152" x2="108" y2="172" stroke="rgba(255,255,255,0.5)" strokeWidth="3" strokeLinecap="round" />
          </>
        )}
        {/* Col en V */}
        {!isHoodie && (
          <path d="M86 138 L100 152 L114 138 L114 145 L100 160 L86 145 Z" fill="rgba(0,0,0,0.15)" />
        )}

        {/* Cou */}
        <rect x="88" y="112" width="24" height="26" rx="10" fill={skin} />
        <rect x="88" y="112" width="24" height="10" fill={skinShade} rx="8" />

        {/* Tête */}
        <g>
          {/* Oreilles */}
          <circle cx="55" cy="78" r="7" fill={skin} />
          <circle cx="145" cy="78" r="7" fill={skin} />
          <circle cx="55" cy="78" r="3" fill={skinShade} />
          <circle cx="145" cy="78" r="3" fill={skinShade} />
          {/* Visage : cercle légèrement aplati avec menton doux */}
          <path
            d="M56 74 C56 46 74 32 100 32 C126 32 144 46 144 74 C144 100 126 118 100 118 C74 118 56 100 56 74 Z"
            fill={skin}
          />
          {/* Ombre sous les cheveux */}
          <path
            d="M58 66 C60 48 76 36 100 36 C124 36 140 48 142 66 C136 58 120 52 100 52 C80 52 64 58 58 66 Z"
            fill={skinShade}
            opacity="0.4"
          />
        </g>

        {/* Cheveux */}
        {hairStyle.startsWith("hair-short") && (
          <g fill={hair}>
            <path d="M54 76 C54 42 72 28 100 28 C128 28 146 42 146 76 C146 66 138 54 128 52 C122 44 112 42 100 42 C88 42 78 44 72 52 C62 54 54 66 54 76 Z" />
            <path d="M66 44 Q76 34 92 32" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="5" strokeLinecap="round" />
          </g>
        )}
        {hairStyle === "hair-long" && (
          <g fill={hair}>
            <path d="M50 118 C46 60 66 26 100 26 C134 26 154 60 150 118 C144 112 142 96 140 82 C138 62 124 44 100 44 C76 44 62 62 60 82 C58 96 56 112 50 118 Z" />
            <path d="M64 48 Q76 32 94 30" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="5" strokeLinecap="round" />
          </g>
        )}
        {hairStyle === "hair-curly" && (
          <g fill={hair}>
            <circle cx="70" cy="42" r="15" />
            <circle cx="100" cy="32" r="17" />
            <circle cx="130" cy="42" r="15" />
            <circle cx="56" cy="60" r="11" />
            <circle cx="144" cy="60" r="11" />
            <path d="M56 62 C60 40 76 30 100 30 C124 30 140 40 144 62 C132 50 116 46 100 46 C84 46 68 50 56 62 Z" />
            <circle cx="83" cy="34" r="4" fill="rgba(255,255,255,0.2)" />
          </g>
        )}
        {hairStyle === "hair-bun" && (
          <g fill={hair}>
            <circle cx="100" cy="18" r="13" />
            <circle cx="96" cy="14" r="4" fill="rgba(255,255,255,0.25)" />
            <path d="M56 76 C56 42 74 28 100 28 C126 28 144 42 144 76 C138 62 126 52 100 52 C74 52 62 62 56 76 Z" />
          </g>
        )}

        {/* Sourcils */}
        <g stroke={hair} strokeWidth="4" strokeLinecap="round" fill="none">
          {expression === "surprised" || expression === "excited" ? (
            <>
              <path d="M74 56 Q82 50 90 54" />
              <path d="M110 54 Q118 50 126 56" />
            </>
          ) : expression === "tired" ? (
            <>
              <path d="M76 60 Q84 62 90 64" />
              <path d="M110 64 Q116 62 124 60" />
            </>
          ) : expression === "focused" ? (
            <>
              <path d="M76 61 L90 62" />
              <path d="M110 62 L124 61" />
            </>
          ) : expression === "proud" ? (
            <>
              <path d="M74 58 Q82 53 90 56" />
              <path d="M110 58 Q118 56 126 60" />
            </>
          ) : (
            <>
              <path d="M75 58 Q83 54 90 57" />
              <path d="M110 57 Q117 54 125 58" />
            </>
          )}
        </g>

        {/* Yeux */}
        {eyesClosed ? (
          <g stroke="#2B2E3A" strokeWidth="3.5" strokeLinecap="round" fill="none">
            <path d="M76 74 Q82 68 88 74" />
            <path d="M112 74 Q118 68 124 74" />
          </g>
        ) : (
          <g>
            <ellipse cx="82" cy="73" rx="7.5" ry={eyesHalf ? 4.5 : 8.5} fill="#FFFFFF" />
            <ellipse cx="118" cy="73" rx="7.5" ry={eyesHalf ? 4.5 : 8.5} fill="#FFFFFF" />
            <motion.g
              animate={animated && !eyesHalf ? { scaleY: [1, 1, 0.08, 1, 1] } : undefined}
              transition={{
                duration: 4.6,
                times: [0, 0.46, 0.5, 0.54, 1],
                repeat: Infinity,
              }}
              style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }}
            >
              <circle cx={expression === "focused" ? 84 : 82} cy={eyesHalf ? 75 : 74} r={eyesWide ? 4.6 : 3.8} fill="#2B2E3A" />
              <circle cx={expression === "focused" ? 120 : 118} cy={eyesHalf ? 75 : 74} r={eyesWide ? 4.6 : 3.8} fill="#2B2E3A" />
              <circle cx="83.5" cy="72" r="1.4" fill="#FFFFFF" />
              <circle cx="119.5" cy="72" r="1.4" fill="#FFFFFF" />
            </motion.g>
            {eyesHalf && (
              <g fill={skin}>
                <rect x="73" y="63" width="18" height="7" rx="3" />
                <rect x="109" y="63" width="18" height="7" rx="3" />
              </g>
            )}
          </g>
        )}

        {/* Bouche */}
        {expression === "surprised" ? (
          <ellipse cx="100" cy="95" rx="6.5" ry="8" fill="#7A3B36" />
        ) : expression === "excited" || expression === "celebrating" ? (
          <path d="M86 90 Q100 106 114 90 Q100 98 86 90 Z" fill="#7A3B36" />
        ) : expression === "tired" ? (
          <path d="M92 96 L108 96" stroke="#7A3B36" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        ) : expression === "focused" ? (
          <path d="M94 95 Q100 98 106 95" stroke="#7A3B36" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        ) : expression === "proud" ? (
          <path d="M90 93 Q100 100 112 91" stroke="#7A3B36" strokeWidth="4" strokeLinecap="round" fill="none" />
        ) : expression === "happy" || expression === "encouraging" ? (
          <path d="M88 91 Q100 102 112 91" stroke="#7A3B36" strokeWidth="4" strokeLinecap="round" fill="none" />
        ) : (
          <path d="M92 94 Q100 99 108 94" stroke="#7A3B36" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        )}

        {/* Joues */}
        {(expression === "happy" ||
          expression === "excited" ||
          expression === "celebrating" ||
          expression === "encouraging") && (
          <g fill="rgba(249,113,74,0.3)">
            <ellipse cx="70" cy="86" rx="6" ry="4" />
            <ellipse cx="130" cy="86" rx="6" ry="4" />
          </g>
        )}

        {/* Accessoires */}
        {accessory?.id.startsWith("acc-glasses") && (
          <g stroke={accessory.color ?? "#2B2E3A"} strokeWidth="3" fill="rgba(255,255,255,0.12)">
            <rect x="70" y="63" width="25" height="21" rx="9" />
            <rect x="105" y="63" width="25" height="21" rx="9" />
            <path d="M95 72 L105 72" fill="none" />
            <path d="M70 70 L57 66" fill="none" />
            <path d="M130 70 L143 66" fill="none" />
          </g>
        )}
        {accessory?.id.startsWith("acc-headphones") && (
          <g>
            <path
              d="M53 74 C53 42 72 24 100 24 C128 24 147 42 147 74"
              fill="none"
              stroke={accessory.color ?? "#585CE2"}
              strokeWidth="8"
              strokeLinecap="round"
            />
            <rect x="45" y="64" width="15" height="26" rx="7" fill={accessory.color ?? "#585CE2"} />
            <rect x="140" y="64" width="15" height="26" rx="7" fill={accessory.color ?? "#585CE2"} />
            <rect x="48" y="68" width="4" height="18" rx="2" fill="rgba(255,255,255,0.35)" />
            <rect x="143" y="68" width="4" height="18" rx="2" fill="rgba(255,255,255,0.35)" />
          </g>
        )}
        {accessory?.id.startsWith("acc-cap") && (
          <g>
            <path
              d="M56 60 C56 36 74 24 100 24 C126 24 144 36 144 60 L56 60 Z"
              fill={accessory.color ?? "#F9714A"}
            />
            <path d="M140 54 L168 60 C170 63 168 66 165 66 L140 61 Z" fill={accessory.color ?? "#F9714A"} />
            <path d="M64 42 Q76 30 94 28" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="4" strokeLinecap="round" />
            <circle cx="100" cy="28" r="3.5" fill="rgba(0,0,0,0.15)" />
          </g>
        )}
        {accessory?.id === "acc-earbuds" && (
          <g>
            <ellipse cx="54" cy="76" rx="6" ry="8" fill={accessory.color ?? "#FFFFFF"} stroke="rgba(23,26,38,0.15)" strokeWidth="1.5" />
            <ellipse cx="146" cy="76" rx="6" ry="8" fill={accessory.color ?? "#FFFFFF"} stroke="rgba(23,26,38,0.15)" strokeWidth="1.5" />
            <rect x="51" y="82" width="5" height="12" rx="2.5" fill={accessory.color ?? "#FFFFFF"} stroke="rgba(23,26,38,0.15)" strokeWidth="1.5" />
            <rect x="144" y="82" width="5" height="12" rx="2.5" fill={accessory.color ?? "#FFFFFF"} stroke="rgba(23,26,38,0.15)" strokeWidth="1.5" />
          </g>
        )}
        {accessory?.id.startsWith("acc-badge") && (
          <g>
            <circle cx="128" cy="158" r="10" fill={accessory.color ?? "#F9714A"} />
            <circle cx="128" cy="158" r="10" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
            <path d="M123 158 L127 162 L134 154" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        )}
      </g>
    </motion.svg>
  );
}
