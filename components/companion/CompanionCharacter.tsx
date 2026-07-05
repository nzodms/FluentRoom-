"use client";

import { motion } from "framer-motion";
import type { CharacterExpression } from "@/components/avatar/FluentCharacter";
import { getCompanion } from "@/data/companions";
import { cn } from "@/lib/utils";

/**
 * Le compagnon FluentRoom : petit animal 2D illustré qui guide,
 * félicite et rassure. Même langage visuel que le personnage,
 * mais avec une vraie présence émotionnelle.
 */

interface CompanionCharacterProps {
  companionId: string | null | undefined;
  expression?: CharacterExpression;
  size?: number;
  animated?: boolean;
  className?: string;
}

export function CompanionCharacter({
  companionId,
  expression = "happy",
  size = 96,
  animated = true,
  className,
}: CompanionCharacterProps) {
  const c = getCompanion(companionId);
  const shade = "rgba(0,0,0,0.14)";
  const celebrate = expression === "celebrating" || expression === "excited";
  const eyesClosed = expression === "celebrating" || expression === "relaxed";
  const eyesWide = expression === "excited" || expression === "surprised";
  const blush =
    expression === "happy" ||
    expression === "encouraging" ||
    expression === "excited" ||
    expression === "celebrating" ||
    expression === "shy";

  const eyeY = 80;
  const eyeRx = c.species === "owl" ? 11 : 8.5;
  const eyeRy = c.species === "owl" ? 12 : 9.5;

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={cn("shrink-0 overflow-visible", className)}
      role="img"
      aria-label={`${c.name}, ton compagnon`}
      animate={
        animated
          ? celebrate
            ? { y: [0, -6, 0] }
            : { y: [0, -2.5, 0] }
          : undefined
      }
      transition={{
        duration: celebrate ? 0.8 : 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {/* Ombre au sol */}
      <ellipse cx="100" cy="192" rx="46" ry="8" fill="rgba(23,26,38,0.12)" />

      {/* Corps */}
      <ellipse cx="100" cy="152" rx="46" ry="40" fill={c.color} />
      <ellipse cx="100" cy="160" rx="29" ry="27" fill={c.belly} />
      {c.species === "dragon" && (
        <g stroke="rgba(0,0,0,0.1)" strokeWidth="2.5" fill="none">
          <path d="M84 152 Q100 158 116 152" />
          <path d="M86 164 Q100 170 114 164" />
        </g>
      )}

      {/* Pattes avant */}
      <ellipse cx="72" cy="184" rx="12" ry="8" fill={c.color} />
      <ellipse cx="128" cy="184" rx="12" ry="8" fill={c.color} />

      {/* Queue (renard/chien/dragon) */}
      {c.species === "fox" && (
        <motion.g
          style={{ transformBox: "fill-box", transformOrigin: "20% 80%" }}
          animate={animated ? { rotate: [0, 6, 0] } : undefined}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M140 160 C168 148 176 128 168 112 C176 136 162 156 138 168 Z" fill={c.color} />
          <path d="M164 116 C170 124 168 136 158 146 C166 134 166 124 164 116 Z" fill={c.belly} />
        </motion.g>
      )}
      {c.species === "dog" && (
        <motion.g
          style={{ transformBox: "fill-box", transformOrigin: "10% 90%" }}
          animate={animated ? { rotate: [0, 12, 0] } : undefined}
          transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M142 162 C160 152 166 140 164 130 C170 146 160 162 144 170 Z" fill={c.color} />
        </motion.g>
      )}
      {c.species === "dragon" && (
        <path d="M142 166 C162 162 172 150 170 138 C178 156 164 172 146 174 Z" fill={c.color} />
      )}

      {/* Oreilles / plumes / cornes (derrière la tête) */}
      {c.species === "fox" && (
        <g>
          <path d="M58 52 L46 10 L90 34 Z" fill={c.color} />
          <path d="M142 52 L154 10 L110 34 Z" fill={c.color} />
          <path d="M62 44 L54 18 L84 36 Z" fill="#3D2B22" />
          <path d="M138 44 L146 18 L116 36 Z" fill="#3D2B22" />
        </g>
      )}
      {c.species === "owl" && (
        <g fill={c.color}>
          <path d="M58 48 L50 22 L80 36 Z" />
          <path d="M142 48 L150 22 L120 36 Z" />
        </g>
      )}
      {c.species === "dog" && (
        <g fill={c.color}>
          <path d="M56 46 C42 52 38 76 46 94 C52 98 60 96 64 88 C58 74 56 58 62 46 Z" />
          <path d="M144 46 C158 52 162 76 154 94 C148 98 140 96 136 88 C142 74 144 58 138 46 Z" />
          <path d="M52 60 C48 70 48 82 52 90" fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="3" strokeLinecap="round" />
        </g>
      )}
      {c.species === "dragon" && (
        <g>
          <path d="M74 38 L68 14 L88 30 Z" fill="#F5E9C8" />
          <path d="M126 38 L132 14 L112 30 Z" fill="#F5E9C8" />
          <path d="M92 30 L100 16 L108 30 Z" fill={c.color} />
        </g>
      )}

      {/* Tête */}
      <circle cx="100" cy="85" r="50" fill={c.color} />

      {/* Face / museau */}
      {c.species === "owl" ? (
        <ellipse cx="100" cy="90" rx="36" ry="32" fill={c.belly} />
      ) : (
        <ellipse cx="100" cy="103" rx="26" ry="18" fill={c.belly} />
      )}
      {c.species === "fox" && (
        <g fill={c.belly}>
          <path d="M60 78 C56 92 60 104 70 110 C64 98 64 86 68 76 Z" />
          <path d="M140 78 C144 92 140 104 130 110 C136 98 136 86 132 76 Z" />
        </g>
      )}

      {/* Yeux */}
      {eyesClosed ? (
        <g stroke="#2B2E3A" strokeWidth="3.5" strokeLinecap="round" fill="none">
          <path d={expression === "relaxed" ? "M72 80 Q80 86 88 80" : "M72 80 Q80 72 88 80"} />
          <path d={expression === "relaxed" ? "M112 80 Q120 86 128 80" : "M112 80 Q120 72 128 80"} />
        </g>
      ) : (
        <g>
          <ellipse cx="80" cy={eyeY} rx={eyeRx} ry={eyeRy} fill="#FFFFFF" />
          <ellipse cx="120" cy={eyeY} rx={eyeRx} ry={eyeRy} fill="#FFFFFF" />
          <motion.g
            animate={animated ? { scaleY: [1, 1, 0.08, 1, 1] } : undefined}
            transition={{ duration: 4.2, times: [0, 0.44, 0.5, 0.56, 1], repeat: Infinity }}
            style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }}
          >
            <circle cx={expression === "focused" ? 82 : 80} cy={eyeY} r={eyesWide ? 5.4 : 4.6} fill="#3A2E24" />
            <circle cx={expression === "focused" ? 122 : 120} cy={eyeY} r={eyesWide ? 5.4 : 4.6} fill="#3A2E24" />
            <circle cx="82" cy={eyeY - 2.5} r="1.7" fill="#FFFFFF" />
            <circle cx="122" cy={eyeY - 2.5} r="1.7" fill="#FFFFFF" />
          </motion.g>
        </g>
      )}

      {/* Truffe / bec */}
      {c.species === "owl" ? (
        <path d="M94 92 L106 92 L100 103 Z" fill="#E0A32E" />
      ) : (
        <path d="M94 96 Q100 92 106 96 Q103 102 100 102 Q97 102 94 96 Z" fill="#3D2B22" />
      )}

      {/* Bouche */}
      {c.species !== "owl" &&
        (expression === "excited" || expression === "celebrating" ? (
          <path d="M88 106 Q100 118 112 106 Q100 112 88 106 Z" fill="#7A3B36" />
        ) : expression === "focused" ? (
          <path d="M94 108 Q100 110 106 108" stroke="#7A3B36" strokeWidth="3" strokeLinecap="round" fill="none" />
        ) : expression === "proud" ? (
          <path d="M92 106 Q100 112 110 104" stroke="#7A3B36" strokeWidth="3.4" strokeLinecap="round" fill="none" />
        ) : (
          <path d="M90 105 Q100 113 110 105" stroke="#7A3B36" strokeWidth="3.4" strokeLinecap="round" fill="none" />
        ))}
      {c.species === "dog" &&
        (expression === "happy" || expression === "excited" || expression === "celebrating") && (
          <path d="M96 108 Q100 118 104 108 Q100 112 96 108 Z" fill="#E5766B" />
        )}

      {/* Joues */}
      {blush && (
        <g fill="rgba(249,113,74,0.3)">
          <ellipse cx="66" cy="94" rx="7" ry="4.5" />
          <ellipse cx="134" cy="94" rx="7" ry="4.5" />
        </g>
      )}

      {/* Reflet de tête */}
      <path
        d="M66 56 Q80 42 98 40"
        fill="none"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* Ombre sous la tête */}
      <path
        d="M62 108 Q100 124 138 108"
        fill="none"
        stroke={shade}
        strokeWidth="0"
      />
    </motion.svg>
  );
}
