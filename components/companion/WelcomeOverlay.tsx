"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { getCompanion } from "@/data/companions";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { CompanionCharacter } from "./CompanionCharacter";

/**
 * Écran d'accueil dans l'espace FluentRoom : le compagnon souhaite
 * la bienvenue avant la visite guidée. Pas de leçon forcée.
 */
export function WelcomeOverlay({
  companionId,
  onDiscover,
  onLater,
}: {
  companionId: string | null;
  onDiscover: () => void;
  onLater: () => void;
}) {
  const companion = getCompanion(companionId);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/45 p-5 backdrop-blur-sm"
      role="dialog"
      aria-label="Bienvenue dans ton espace"
    >
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 280, damping: 24 }}
        className="w-full max-w-sm rounded-[2rem] bg-white p-6 text-center shadow-lift"
      >
        <motion.div
          initial={{ scale: 0.6, y: 10 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 240, damping: 15, delay: 0.15 }}
          className="relative mx-auto inline-block"
        >
          <span
            aria-hidden
            className="absolute inset-0 -z-10 scale-125 rounded-full blur-2xl"
            style={{ background: `${companion.color}33` }}
          />
          <CompanionCharacter
            companionId={companionId}
            size={116}
            expression="celebrating"
          />
        </motion.div>
        <Chip tone="primary" className="mt-2">
          <Sparkles className="size-3" /> {companion.name} · {companion.personality}
        </Chip>
        <h2 className="mt-2.5 text-2xl font-bold tracking-tight text-ink">
          Bienvenue dans ton espace
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Je vais t&apos;accompagner pour progresser en anglais sans te perdre.
          Avant ta première leçon, je te montre rapidement comment ça marche.
        </p>
        <Button size="lg" fullWidth className="mt-5" onClick={onDiscover}>
          Découvrir mon espace
        </Button>
        <button
          onClick={onLater}
          className="mt-3 cursor-pointer text-xs font-semibold text-ink-faint transition-colors hover:text-ink"
        >
          Plus tard
        </button>
      </motion.div>
    </motion.div>
  );
}
