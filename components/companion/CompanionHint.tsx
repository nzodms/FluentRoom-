"use client";

import { motion } from "framer-motion";
import type { UserProgress } from "@/types/learning";
import type { CharacterExpression } from "@/components/avatar/FluentCharacter";
import { companionLook } from "@/lib/companion";
import { CompanionCharacter } from "./CompanionCharacter";

/**
 * Conseil discret du compagnon hors de Today : une ligne, jamais
 * envahissant — juste une sensation de continuité entre les onglets.
 */
export function CompanionHint({
  progress,
  line,
  expression = "encouraging",
  delay = 0.08,
}: {
  progress: UserProgress;
  line: string;
  expression?: CharacterExpression;
  delay?: number;
}) {
  const look = companionLook(progress);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="flex items-center gap-3 rounded-3xl bg-white p-3 shadow-soft"
    >
      <CompanionCharacter
        companionId={progress.companion}
        size={44}
        expression={expression}
        accessories={look.accessories}
      />
      <p className="min-w-0 flex-1 text-sm font-semibold leading-snug text-ink">
        {line}
      </p>
    </motion.div>
  );
}
