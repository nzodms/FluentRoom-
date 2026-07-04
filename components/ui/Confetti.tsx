"use client";

import { motion } from "framer-motion";

const COLORS = ["#585ce2", "#f9714a", "#2cb783", "#eec153", "#9d9ff0"];

/** Particules déterministes : célébration légère, pas de random au rendu. */
function particles(count: number) {
  const items = [];
  let x = 42;
  for (let i = 0; i < count; i++) {
    x = (x * 9301 + 49297) % 233280;
    const r1 = x / 233280;
    x = (x * 9301 + 49297) % 233280;
    const r2 = x / 233280;
    x = (x * 9301 + 49297) % 233280;
    const r3 = x / 233280;
    items.push({
      left: r1 * 100,
      delay: r2 * 0.6,
      duration: 2 + r3 * 1.6,
      color: COLORS[i % COLORS.length],
      size: 6 + Math.round(r3 * 6),
      rotate: r1 * 360,
    });
  }
  return items;
}

export function Confetti({ count = 28 }: { count?: number }) {
  const items = particles(count);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-[3px]"
          style={{
            left: `${p.left}%`,
            top: -16,
            width: p.size,
            height: p.size * 0.6,
            backgroundColor: p.color,
          }}
          initial={{ y: -20, opacity: 1, rotate: 0 }}
          animate={{
            y: "110vh",
            opacity: [1, 1, 0.9, 0],
            rotate: p.rotate + 360,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: [0.2, 0.6, 0.4, 1],
          }}
        />
      ))}
    </div>
  );
}
