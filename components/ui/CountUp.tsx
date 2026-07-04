"use client";

import { useEffect, useState } from "react";
import { animate } from "framer-motion";

interface CountUpProps {
  /** Valeur cible. */
  value: number;
  /** Valeur de départ (défaut 0). */
  from?: number;
  duration?: number;
  delay?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

/** Nombre qui compte jusqu'à sa valeur — le petit plaisir des dashboards. */
export function CountUp({
  value,
  from = 0,
  duration = 1,
  delay = 0,
  suffix = "",
  prefix = "",
  className,
}: CountUpProps) {
  const [display, setDisplay] = useState(from);

  useEffect(() => {
    const controls = animate(from, value, {
      duration,
      delay,
      ease: [0.21, 0.6, 0.35, 1],
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return () => controls.stop();
  }, [from, value, duration, delay]);

  return (
    <span className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
