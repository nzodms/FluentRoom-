"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { normalizeText } from "@/lib/scoring";
import { cn } from "@/lib/utils";

interface WordOrderProps {
  words: string[];
  answer: string;
  onResult: (correct: boolean) => void;
  /** Libellé du bouton de validation. */
  ctaLabel?: string;
}

/** Mélange déterministe (pas de random au rendu → pas de mismatch SSR). */
function shuffled(words: string[]): string[] {
  const arr = words.map((word, i) => ({ word, i }));
  arr.sort((a, b) => {
    const ha = (a.word.length * 31 + a.i * 17) % 7;
    const hb = (b.word.length * 31 + b.i * 17) % 7;
    return ha - hb || a.word.localeCompare(b.word);
  });
  return arr.map((x) => x.word);
}

/** Exercice "remets les mots dans l'ordre" — chips satisfaisantes, feedback immédiat. */
export function WordOrder({
  words,
  answer,
  onResult,
  ctaLabel = "Valider",
}: WordOrderProps) {
  const pool = useMemo(() => shuffled(words), [words]);
  const [picked, setPicked] = useState<number[]>([]);
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);

  const sentence = picked.map((i) => pool[i]).join(" ");

  const validate = () => {
    const ok = normalizeText(sentence) === normalizeText(answer);
    setResult(ok ? "correct" : "wrong");
    onResult(ok);
  };

  const reset = () => {
    setPicked([]);
    setResult(null);
  };

  return (
    <div>
      {/* Zone de construction */}
      <div
        className={cn(
          "card-soft flex min-h-14 flex-wrap items-center gap-2 p-3 transition-all",
          result === "correct" && "ring-2 ring-mint-500 bg-mint-50",
          result === "wrong" && "ring-2 ring-coral-500 bg-coral-50",
        )}
      >
        {picked.length === 0 && (
          <span className="px-1 text-sm text-ink-faint">
            Touche les mots dans l&apos;ordre…
          </span>
        )}
        <AnimatePresence>
          {picked.map((poolIndex, position) => (
            <motion.button
              key={`${poolIndex}`}
              layout
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              whileTap={{ scale: 0.92 }}
              disabled={result === "correct"}
              onClick={() =>
                setPicked((prev) => prev.filter((_, i) => i !== position))
              }
              className="cursor-pointer rounded-xl bg-primary-500 px-3 py-1.5 text-sm font-bold text-white shadow-soft"
            >
              {pool[poolIndex]}
            </motion.button>
          ))}
        </AnimatePresence>
        {result === "correct" && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="ml-auto grid size-7 place-items-center rounded-full bg-mint-500 text-white"
          >
            <Check className="size-4" strokeWidth={3.5} />
          </motion.span>
        )}
        {result === "wrong" && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="ml-auto grid size-7 place-items-center rounded-full bg-coral-500 text-white"
          >
            <X className="size-4" strokeWidth={3.5} />
          </motion.span>
        )}
      </div>

      {/* Mots disponibles */}
      <div className="mt-3 flex flex-wrap gap-2">
        {pool.map((word, i) => {
          const used = picked.includes(i);
          return (
            <motion.button
              key={i}
              whileTap={!used ? { scale: 0.9 } : undefined}
              disabled={used || result === "correct"}
              onClick={() => {
                setPicked((prev) => [...prev, i]);
                setResult(null);
              }}
              className={cn(
                "rounded-xl px-3 py-1.5 text-sm font-bold transition-all",
                used
                  ? "bg-ink/5 text-transparent select-none"
                  : "card-soft cursor-pointer text-ink hover:ring-2 hover:ring-primary-200",
              )}
            >
              {word}
            </motion.button>
          );
        })}
      </div>

      {result === "wrong" && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 text-sm font-semibold text-coral-600"
        >
          Presque — remets les mots dans l&apos;ordre naturel et réessaie.
        </motion.p>
      )}

      <div className="mt-4 flex gap-2">
        <Button
          size="sm"
          disabled={picked.length !== pool.length || result === "correct"}
          onClick={validate}
        >
          {ctaLabel}
        </Button>
        {picked.length > 0 && result !== "correct" && (
          <Button size="sm" variant="ghost" onClick={reset}>
            <RotateCcw className="size-3.5" /> Recommencer
          </Button>
        )}
      </div>
    </div>
  );
}
