"use client";

import { motion } from "framer-motion";
import { Sparkles, Zap } from "lucide-react";
import type { ChestVariant } from "@/data/chest-variants";
import { CHEST_STYLES } from "@/data/chest-variants";

/** Positions déterministes pour les particules (pas de random au rendu). */
function particleField(count: number) {
  const dots = [];
  let x = 97;
  for (let i = 0; i < count; i++) {
    x = (x * 9301 + 49297) % 233280;
    const r1 = x / 233280;
    x = (x * 9301 + 49297) % 233280;
    const r2 = x / 233280;
    x = (x * 9301 + 49297) % 233280;
    const r3 = x / 233280;
    dots.push({
      left: 5 + r1 * 90,
      top: 5 + r2 * 75,
      size: 2 + r3 * 3,
      delay: r1 * 4,
      duration: 5 + r2 * 5,
    });
  }
  return dots;
}

/**
 * La "Reward Room" : décor nocturne violet profond, halo qui respire,
 * rayons lents, particules flottantes, plateforme au sol, vignette.
 */
export function RewardRoomBackground({
  variant = "daily",
}: {
  variant?: ChestVariant;
}) {
  const style = CHEST_STYLES[variant];
  const dots = particleField(16);

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      {/* Nuit violette profonde */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #1B1740 0%, #241E55 45%, #2E2566 100%)",
        }}
      />

      {/* Rayons lents derrière le coffre */}
      <motion.div
        className="absolute left-1/2 top-[46%] size-[560px] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.05) 12deg, transparent 24deg, transparent 60deg, rgba(255,255,255,0.05) 72deg, transparent 84deg, transparent 120deg, rgba(255,255,255,0.05) 132deg, transparent 144deg, transparent 180deg, rgba(255,255,255,0.05) 192deg, transparent 204deg, transparent 240deg, rgba(255,255,255,0.05) 252deg, transparent 264deg, transparent 300deg, rgba(255,255,255,0.05) 312deg, transparent 324deg)",
          maskImage:
            "radial-gradient(circle, black 0%, black 45%, transparent 72%)",
          WebkitMaskImage:
            "radial-gradient(circle, black 0%, black 45%, transparent 72%)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      />

      {/* Halo central qui respire */}
      <motion.div
        className="absolute left-1/2 top-[44%] size-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: `radial-gradient(circle, ${style.halo}, transparent 65%)`,
        }}
        animate={{ scale: [1, 1.12, 1], opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Particules flottantes */}
      {dots.map((dot, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${dot.left}%`,
            top: `${dot.top}%`,
            width: dot.size,
            height: dot.size,
          }}
          animate={{ y: [0, -18, 0], opacity: [0.15, 0.6, 0.15] }}
          transition={{
            duration: dot.duration,
            delay: dot.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Objets flottants très légers */}
      <motion.span
        className="absolute left-[12%] top-[22%] text-white/20"
        animate={{ y: [0, -10, 0], rotate: [0, 8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <Sparkles className="size-6" />
      </motion.span>
      <motion.span
        className="absolute right-[14%] top-[30%] text-white/15"
        animate={{ y: [0, -14, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 8.5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
      >
        <Zap className="size-7" />
      </motion.span>
      <motion.span
        className="absolute left-[18%] top-[58%] h-8 w-6 rounded-md border-2 border-white/10"
        animate={{ y: [0, -8, 0], rotate: [-6, 4, -6] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
      />
      <motion.span
        className="absolute right-[16%] top-[60%] h-7 w-5 rounded-md border-2 border-white/10"
        animate={{ y: [0, -10, 0], rotate: [5, -5, 5] }}
        transition={{ duration: 7.6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* Plateforme au sol */}
      <div
        className="absolute left-1/2 top-[62%] h-24 w-[340px] -translate-x-1/2 rounded-[50%]"
        style={{
          background:
            "radial-gradient(ellipse, rgba(255,255,255,0.1), transparent 70%)",
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center 45%, transparent 45%, rgba(14,11,35,0.55) 100%)",
        }}
      />
    </div>
  );
}
