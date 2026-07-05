"use client";

import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/**
 * Construction de phrase premium : les mots volent de la banque vers
 * la zone de phrase (layout animation), se retirent au tap, et le
 * bouton Valider ne s'active que quand la phrase est complète.
 */
export function PhraseBuilder({
  words,
  answer,
  onResult,
}: {
  words: string[];
  answer: string;
  onResult: (correct: boolean) => void;
}) {
  // Ordre des index de mots placés dans la phrase.
  const [placed, setPlaced] = useState<number[]>([]);
  const [shake, setShake] = useState(false);

  const remaining = words.map((_, i) => i).filter((i) => !placed.includes(i));
  const complete = placed.length === words.length;

  const normalize = (s: string) =>
    s.toLowerCase().replace(/[.,!?']/g, "").replace(/\s+/g, " ").trim();

  const validate = () => {
    const built = placed.map((i) => words[i]).join(" ");
    const correct = normalize(built) === normalize(answer);
    onResult(correct);
    if (!correct) {
      setShake(true);
      setTimeout(() => {
        setShake(false);
        setPlaced([]);
      }, 500);
    }
  };

  return (
    <LayoutGroup>
      <div>
        {/* Zone de phrase construite */}
        <motion.div
          animate={shake ? { x: [0, -8, 8, -5, 5, 0] } : { x: 0 }}
          transition={shake ? { duration: 0.45 } : undefined}
          className={cn(
            "relative flex min-h-24 flex-wrap content-start items-start gap-2 rounded-3xl border-2 p-4 transition-colors",
            shake
              ? "border-coral-300 bg-coral-50/50"
              : complete
                ? "border-primary-300 bg-primary-50/50"
                : "border-dashed border-ink/12 bg-white/70",
          )}
        >
          {/* Halo doux derrière la zone */}
          <span
            aria-hidden
            className="pointer-events-none absolute -inset-3 -z-10 rounded-[2rem] bg-primary-400/8 blur-xl"
          />
          {placed.length === 0 && (
            <span className="flex items-center gap-2 text-sm font-medium text-ink-faint">
              <motion.span
                aria-hidden
                className="inline-flex gap-1"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              >
                <span className="size-1.5 rounded-full bg-primary-300" />
                <span className="size-1.5 rounded-full bg-primary-300" />
                <span className="size-1.5 rounded-full bg-primary-300" />
              </motion.span>
              Compose ta phrase, mot par mot
            </span>
          )}
          {placed.map((wordIndex) => (
            <motion.button
              key={wordIndex}
              layoutId={`pb-word-${wordIndex}`}
              transition={{ type: "spring", stiffness: 420, damping: 30 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setPlaced((p) => p.filter((i) => i !== wordIndex))}
              className="cursor-pointer rounded-2xl gradient-primary px-3.5 py-2 text-[15px] font-bold text-white shadow-glow"
            >
              {words[wordIndex]}
            </motion.button>
          ))}
        </motion.div>

        {/* Progression de construction */}
        <div className="mt-2.5 flex items-center gap-2">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-ink/8">
            <motion.div
              className="h-full rounded-full gradient-mint"
              animate={{ width: `${(placed.length / words.length) * 100}%` }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
            />
          </div>
          <span className="text-xs font-bold text-ink-faint">
            {placed.length}/{words.length}
          </span>
        </div>

        {/* Banque de mots */}
        <div className="mt-4 flex min-h-12 flex-wrap justify-center gap-2">
          <AnimatePresence>
            {remaining.map((wordIndex) => (
              <motion.button
                key={wordIndex}
                layoutId={`pb-word-${wordIndex}`}
                transition={{ type: "spring", stiffness: 420, damping: 30 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => setPlaced((p) => [...p, wordIndex])}
                className="cursor-pointer rounded-2xl border-2 border-ink/8 bg-white px-3.5 py-2 text-[15px] font-bold text-ink shadow-soft transition-colors hover:border-primary-300"
              >
                {words[wordIndex]}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-4">
          <Button size="lg" fullWidth disabled={!complete} onClick={validate}>
            Valider
          </Button>
        </div>
      </div>
    </LayoutGroup>
  );
}
