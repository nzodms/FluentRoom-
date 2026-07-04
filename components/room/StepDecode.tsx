"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, SearchCheck, Volume2 } from "lucide-react";
import type { Room } from "@/types/learning";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { LearningScreen } from "@/components/session/LearningScreen";
import { speakText } from "@/lib/speech";
import { cn } from "@/lib/utils";

export function StepDecode({
  room,
  onNext,
}: {
  room: Room;
  onNext: () => void;
}) {
  const [openIndex, setOpenIndex] = useState<number>(0);
  const [visited, setVisited] = useState<Set<number>>(new Set([0]));

  const open = (i: number) => {
    setOpenIndex(i === openIndex ? -1 : i);
    setVisited((prev) => new Set(prev).add(i));
  };

  return (
    <LearningScreen
      label={
        <Chip tone="primary">
          <SearchCheck className="size-3" /> Decode ·{" "}
          {visited.size}/{room.decodeNotes.length}
        </Chip>
      }
      title="Décode les phrases clés"
      subtitle="Touche chaque phrase. Retiens le bloc, pas la règle."
      action={
        <Button size="lg" fullWidth onClick={onNext}>
          À toi de répéter
        </Button>
      }
    >
      <div className="space-y-2.5">
        {room.decodeNotes.map((note, i) => {
          const isOpen = openIndex === i;
          return (
            <motion.div
              key={note.line}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.05 }}
              className={cn(
                "overflow-hidden transition-all",
                isOpen ? "card-tint-primary shadow-lift" : "card-soft",
                visited.has(i) && !isOpen && "opacity-80",
              )}
            >
              <button
                onClick={() => open(i)}
                className="flex w-full cursor-pointer items-center gap-3 p-3.5 text-left"
              >
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    speakText(note.line);
                  }}
                  role="button"
                  aria-label={`Écouter : ${note.line}`}
                  className="grid size-8 shrink-0 place-items-center rounded-full bg-primary-50 text-primary-600 transition-colors hover:bg-primary-100"
                >
                  <Volume2 className="size-3.5" strokeWidth={2.2} />
                </span>
                <p className="min-w-0 flex-1 text-[15px] font-bold text-ink">
                  &ldquo;{note.line}&rdquo;
                </p>
                <ChevronDown
                  className={cn(
                    "size-4 shrink-0 text-ink-faint transition-transform",
                    isOpen && "rotate-180",
                  )}
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-2 px-3.5 pb-3.5">
                      <p className="text-sm font-semibold text-ink">
                        {note.translation}
                      </p>
                      <p className="text-sm text-ink-soft">
                        {note.explanation}
                      </p>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          delay: 0.15,
                          type: "spring",
                          stiffness: 350,
                          damping: 20,
                        }}
                      >
                        <span className="inline-flex items-center gap-1.5 rounded-xl gradient-primary px-3 py-1.5 text-sm font-bold text-white shadow-glow">
                          🧩 {note.chunk}
                        </span>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </LearningScreen>
  );
}
