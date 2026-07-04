"use client";

import { motion } from "framer-motion";
import { Mic, Square } from "lucide-react";
import { cn } from "@/lib/utils";

interface MicRecorderProps {
  listening: boolean;
  supported: boolean;
  onStart: () => void;
  onStop: () => void;
  size?: "md" | "lg";
}

/** Bouton micro avec halo animé pendant l'écoute. */
export function MicRecorder({
  listening,
  supported,
  onStart,
  onStop,
  size = "lg",
}: MicRecorderProps) {
  const dimension = size === "lg" ? "size-20" : "size-14";
  const icon = size === "lg" ? "size-8" : "size-6";

  if (!supported) return null;

  return (
    <div className="relative inline-flex items-center justify-center">
      {listening && (
        <>
          <motion.span
            className="absolute inset-0 rounded-full bg-coral-400/30"
            animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
          />
          <motion.span
            className="absolute inset-0 rounded-full bg-coral-400/30"
            animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              ease: "easeOut",
              delay: 0.5,
            }}
          />
        </>
      )}
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={listening ? onStop : onStart}
        aria-label={listening ? "Arrêter l'enregistrement" : "Parler"}
        className={cn(
          "relative grid place-items-center rounded-full text-white cursor-pointer transition-shadow",
          dimension,
          listening
            ? "bg-coral-500 shadow-[0_8px_24px_-6px_rgba(249,113,74,0.6)]"
            : "gradient-primary shadow-glow",
        )}
      >
        {listening ? (
          <Square className={cn(icon, "fill-current")} />
        ) : (
          <Mic className={icon} strokeWidth={2.2} />
        )}
      </motion.button>
    </div>
  );
}
