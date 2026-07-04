"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Volume2 } from "lucide-react";
import { speakText } from "@/lib/speech";
import { cn } from "@/lib/utils";

const BAR_HEIGHTS = [10, 18, 26, 16, 30, 22, 12, 26, 18, 10, 22, 14];

/**
 * Carte audio premium : bouton play + waveform qui s'anime
 * pendant la lecture. La phrase n'est jamais affichée — on écoute.
 */
export function OnboardingAudioCard({ text }: { text: string }) {
  const [playing, setPlaying] = useState(false);
  const [played, setPlayed] = useState(false);

  const play = () => {
    setPlayed(true);
    const ok = speakText(text, {
      rate: 0.92,
      onEnd: () => setPlaying(false),
    });
    if (ok) setPlaying(true);
  };

  return (
    <div className="card-tint-primary flex items-center gap-4 p-4">
      <motion.button
        type="button"
        whileTap={{ scale: 0.92 }}
        onClick={play}
        aria-label="Écouter la phrase"
        className="relative grid size-14 shrink-0 cursor-pointer place-items-center rounded-full gradient-primary text-white shadow-glow"
      >
        {playing && (
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full bg-primary-400/50"
            animate={{ scale: [1, 1.35], opacity: [0.6, 0] }}
            transition={{ duration: 1.1, repeat: Infinity }}
          />
        )}
        {playing ? (
          <Volume2 className="size-6" />
        ) : (
          <Play className="ml-0.5 size-6" fill="currentColor" />
        )}
      </motion.button>
      <div className="min-w-0 flex-1">
        <div className="flex h-9 items-center gap-1">
          {BAR_HEIGHTS.map((h, i) => (
            <motion.span
              key={i}
              className={cn(
                "w-1.5 rounded-full",
                playing ? "bg-primary-500" : "bg-primary-300/60",
              )}
              animate={
                playing
                  ? { height: [h * 0.4, h, h * 0.5, h * 0.9, h * 0.4] }
                  : { height: h * 0.55 }
              }
              transition={
                playing
                  ? { duration: 0.9, repeat: Infinity, delay: i * 0.07 }
                  : { duration: 0.3 }
              }
            />
          ))}
        </div>
        <p className="mt-1 text-xs font-semibold text-primary-600">
          {playing
            ? "Écoute bien…"
            : played
              ? "Réécoute si tu veux, puis réponds."
              : "Appuie pour écouter la phrase."}
        </p>
      </div>
    </div>
  );
}
