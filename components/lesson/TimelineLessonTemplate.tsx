"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Volume2 } from "lucide-react";
import { speakText } from "@/lib/speech";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { LearningScreen } from "@/components/session/LearningScreen";
import { LearningGlyph } from "@/components/icons/learning-icons";
import { cn } from "@/lib/utils";
import type { StepProps } from "./lesson-steps";

/**
 * Template "timeline" : la leçon est un voyage le long d'une ligne.
 * Chaque exemple est une étape ; on avance physiquement sur l'axe.
 */

/* ---------- Hook façon ligne du temps ---------- */

export function StepTimelineHook({ lesson, onNext }: StepProps) {
  return (
    <LearningScreen
      centered
      title=""
      action={
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Button size="lg" fullWidth onClick={onNext}>
            Embarquer <ArrowRight className="size-4" />
          </Button>
        </motion.div>
      }
    >
      <div className="text-center">
        <Chip tone="primary" className="mb-4">
          ⏳ Leçon voyage
        </Chip>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold tracking-tight text-ink"
        >
          {lesson.structure}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mx-auto mt-3 max-w-xs text-lg text-ink-soft"
        >
          {lesson.objective}
        </motion.p>

        {/* Ligne animée : le point voyage d'un bout à l'autre */}
        <div className="relative mx-auto mt-8 h-10 w-full max-w-xs">
          <span className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-ink/8" />
          <motion.span
            className="absolute left-0 top-1/2 h-1 origin-left -translate-y-1/2 rounded-full gradient-primary"
            style={{ right: 0 }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.4, delay: 0.3, ease: "easeInOut" }}
          />
          <motion.span
            className="absolute top-1/2 size-4 -translate-y-1/2 rounded-full bg-primary-500 shadow-glow"
            initial={{ left: "0%" }}
            animate={{ left: "calc(100% - 1rem)" }}
            transition={{ duration: 1.4, delay: 0.3, ease: "easeInOut" }}
          />
          <span className="absolute -left-1 top-full mt-1 text-[10px] font-bold uppercase tracking-wide text-ink-faint">
            Départ
          </span>
          <span className="absolute -right-1 top-full mt-1 text-[10px] font-bold uppercase tracking-wide text-ink-faint">
            Réflexe
          </span>
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-6 text-sm font-semibold text-primary-600"
        >
          {lesson.examples.length} étapes · une situation à chaque arrêt
        </motion.p>
      </div>
    </LearningScreen>
  );
}

/* ---------- Le voyage : un arrêt = une situation ---------- */

export function StepTimelineJourney({ lesson, onNext }: StepProps) {
  const stops = lesson.examples.slice(0, 4);
  const [active, setActive] = useState(0);
  const [visited, setVisited] = useState<Set<number>>(new Set([0]));
  const allVisited = visited.size >= stops.length;

  const goTo = (i: number) => {
    setActive(i);
    setVisited((v) => new Set(v).add(i));
    speakText(stops[i].english);
  };

  const current = stops[active];

  return (
    <LearningScreen
      label={
        <Chip tone="primary">
          ⏳ Voyage · arrêt {active + 1}/{stops.length}
        </Chip>
      }
      title="Avance d'arrêt en arrêt"
      subtitle="À chaque arrêt, la même structure dans une nouvelle situation."
      action={
        <Button
          size="lg"
          fullWidth
          disabled={!allVisited}
          onClick={onNext}
        >
          {allVisited
            ? "Terminus : au piège"
            : `Visite les ${stops.length} arrêts`}
        </Button>
      }
      centered
    >
      {/* Carte de l'arrêt actif */}
      <motion.div
        key={active}
        initial={{ opacity: 0, y: 14, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className="card-tint-primary p-5 text-center"
      >
        <p className="text-xl font-bold text-ink">{current.english}</p>
        <p className="mt-1.5 text-sm text-ink-soft">{current.french}</p>
        <button
          onClick={() => speakText(current.english)}
          className="mx-auto mt-3 inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary-600 shadow-soft transition-colors hover:bg-primary-50"
        >
          <Volume2 className="size-4" /> Réécouter
        </button>
      </motion.div>

      {/* La ligne + les arrêts */}
      <div className="relative mx-2 mt-8 h-14">
        <span className="absolute left-0 right-0 top-3 h-1 rounded-full bg-ink/8" />
        <motion.span
          className="absolute left-0 top-3 h-1 rounded-full gradient-primary"
          animate={{
            width: `${(active / Math.max(stops.length - 1, 1)) * 100}%`,
          }}
          transition={{ type: "spring", stiffness: 200, damping: 26 }}
        />
        <div className="absolute inset-x-0 top-0 flex justify-between">
          {stops.map((stop, i) => {
            const seen = visited.has(i);
            return (
              <button
                key={stop.english}
                onClick={() => goTo(i)}
                aria-label={`Arrêt ${i + 1}`}
                className="flex cursor-pointer flex-col items-center gap-1.5"
              >
                <motion.span
                  animate={
                    i === active
                      ? { scale: 1.25 }
                      : { scale: 1 }
                  }
                  className={cn(
                    "grid size-7 place-items-center rounded-full text-[11px] font-bold transition-colors",
                    i === active
                      ? "gradient-primary text-white shadow-glow"
                      : seen
                        ? "bg-primary-100 text-primary-600"
                        : "border-2 border-dashed border-ink/15 bg-white text-ink-faint",
                  )}
                >
                  {i + 1}
                </motion.span>
                <span
                  className={cn(
                    "text-[9px] font-bold uppercase tracking-wide",
                    i === active ? "text-primary-600" : "text-ink-faint",
                  )}
                >
                  {seen ? "vu" : "·"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex justify-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          disabled={active === 0}
          onClick={() => goTo(active - 1)}
        >
          ← Arrêt précédent
        </Button>
        <Button
          size="sm"
          disabled={active >= stops.length - 1}
          onClick={() => goTo(active + 1)}
        >
          Arrêt suivant →
        </Button>
      </div>
    </LearningScreen>
  );
}

/* ---------- Recap express avant de parler ---------- */

export function StepTimelineRecap({ lesson, onNext }: StepProps) {
  return (
    <LearningScreen
      label={
        <Chip tone="mint">
          <LearningGlyph name="lesson" className="size-3" /> Fin de ligne
        </Chip>
      }
      title="Le trajet en une image"
      subtitle="Une structure, quatre situations. C'est ça, un réflexe."
      action={
        <Button size="lg" fullWidth onClick={onNext}>
          Dernière étape : dis-la
        </Button>
      }
      centered
    >
      <div className="space-y-2">
        {lesson.examples.slice(0, 4).map((example, i) => (
          <motion.div
            key={example.english}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.12 }}
            className="flex items-center gap-3"
          >
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-mint-100 text-[11px] font-bold text-mint-600">
              {i + 1}
            </span>
            <span className="h-px flex-none w-3 bg-ink/10" />
            <p className="min-w-0 flex-1 truncate text-sm font-semibold text-ink">
              {example.english}
            </p>
          </motion.div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-4 rounded-2xl bg-mint-50 p-3.5 text-sm text-mint-600"
      >
        🧠 Même départ, destinations différentes :{" "}
        <span className="font-bold">« {lesson.structure} »</span> est ton
        véhicule.
      </motion.div>
    </LearningScreen>
  );
}
