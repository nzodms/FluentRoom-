"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageSquareQuote, Mic, Volume2 } from "lucide-react";
import type { Room } from "@/types/learning";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { speakText } from "@/lib/speech";
import { useRecognition } from "@/lib/useRecognition";
import { MicRecorder } from "./MicRecorder";

export function StepSpeakBack({
  room,
  onNext,
}: {
  room: Room;
  onNext: (answered: boolean) => void;
}) {
  const [typed, setTyped] = useState("");
  const [revealed, setRevealed] = useState(false);
  const recognition = useRecognition();

  const answer = recognition.transcript || typed.trim();

  return (
    <div className="flex flex-1 flex-col">
      <Chip tone="coral" className="self-start">
        <MessageSquareQuote className="size-3" /> Étape 6 · Speak Back
      </Chip>
      <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink">
        À toi de répondre
      </h2>
      <p className="mt-1.5 text-ink-soft">
        <span className="font-semibold text-ink">Natural, not perfect.</span>{" "}
        Réponds comme tu le ferais dans la vraie vie.
      </p>

      <div className="card-soft mt-6 p-5">
        <p className="text-sm font-semibold text-ink-soft">
          📍 {room.speakBack.situation}
        </p>
        <div className="mt-4 flex items-start gap-3 rounded-2xl bg-primary-50 p-4">
          <button
            onClick={() => speakText(room.speakBack.heard)}
            aria-label="Écouter"
            className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-full bg-white text-primary-600 shadow-soft"
          >
            <Volume2 className="size-4" strokeWidth={2.2} />
          </button>
          <p className="pt-1.5 font-semibold text-primary-700">
            &ldquo;{room.speakBack.heard}&rdquo;
          </p>
        </div>
      </div>

      {!revealed ? (
        <>
          <div className="mt-6 flex flex-col items-center">
            {recognition.supported && (
              <>
                <MicRecorder
                  listening={recognition.listening}
                  supported={recognition.supported}
                  onStart={recognition.start}
                  onStop={recognition.stop}
                />
                <p className="mt-3 text-sm font-medium text-ink-faint">
                  {recognition.listening
                    ? "Je t'écoute…"
                    : "Réponds à voix haute"}
                </p>
              </>
            )}
            {recognition.transcript && (
              <p className="mt-2 rounded-xl bg-ink/5 px-3 py-1.5 text-sm italic text-ink-soft">
                “{recognition.transcript}”
              </p>
            )}
          </div>

          <div className="mt-5">
            <p className="mb-2 text-sm font-semibold text-ink-soft">
              {recognition.supported ? "Ou écris ta réponse :" : "Écris ta réponse :"}
            </p>
            <input
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder="Type your reply in English…"
              className="card-soft w-full p-4 text-[15px] text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
          </div>

          <div className="mt-auto space-y-2.5 pt-6">
            <Button
              size="lg"
              fullWidth
              disabled={!answer}
              onClick={() => setRevealed(true)}
            >
              Comparer aux réponses naturelles
            </Button>
            <Button variant="ghost" fullWidth onClick={() => setRevealed(true)}>
              Je bloque, montre-moi les réponses
            </Button>
          </div>
        </>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-1 flex-col"
          >
            {answer && (
              <div className="mt-5 rounded-2xl bg-ink/5 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-ink-faint">
                  Ta réponse
                </p>
                <p className="mt-1 font-medium text-ink">“{answer}”</p>
              </div>
            )}
            <p className="mt-5 text-sm font-bold text-ink">
              3 réponses 100 % naturelles :
            </p>
            <div className="mt-2.5 space-y-2.5">
              {room.speakBack.suggestedAnswers.map((suggestion, i) => (
                <motion.div
                  key={suggestion}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.12 }}
                  className="card-soft flex items-center gap-3 p-4"
                >
                  <button
                    onClick={() => speakText(suggestion)}
                    aria-label="Écouter"
                    className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-full bg-mint-50 text-mint-600"
                  >
                    <Volume2 className="size-3.5" strokeWidth={2.2} />
                  </button>
                  <p className="font-semibold text-ink">
                    &ldquo;{suggestion}&rdquo;
                  </p>
                </motion.div>
              ))}
            </div>
            <div className="mt-4 rounded-2xl bg-mint-50 p-4 text-sm text-mint-600">
              🗣️ Si ta réponse ressemble à l&apos;une d&apos;elles, même de
              loin : c&apos;est gagné.{" "}
              <span className="font-bold">Say it like you would in real life.</span>
            </div>
            <div className="mt-auto pt-6">
              <Button size="lg" fullWidth onClick={() => onNext(Boolean(answer))}>
                <Mic className="size-4" /> Débloquer mes phrases
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
