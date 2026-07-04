"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageSquareQuote, Mic, Send, Volume2 } from "lucide-react";
import type { Room } from "@/types/learning";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { speakText } from "@/lib/speech";
import { useRecognition } from "@/lib/useRecognition";
import { MicRecorder } from "./MicRecorder";
import { cn } from "@/lib/utils";

/** Bulle de conversation — la room devient un vrai échange. */
function Bubble({
  side,
  children,
  delay = 0,
  tone = "other",
}: {
  side: "left" | "right";
  children: React.ReactNode;
  delay?: number;
  tone?: "other" | "me" | "native";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, type: "spring", stiffness: 320, damping: 24 }}
      className={cn(
        "flex w-full",
        side === "right" ? "justify-end" : "justify-start",
      )}
    >
      <div
        className={cn(
          "max-w-[85%] rounded-3xl px-4 py-3 text-[15px] shadow-soft",
          tone === "me" && "gradient-primary rounded-br-lg text-white",
          tone === "other" && "bg-white rounded-bl-lg text-ink border border-ink/5",
          tone === "native" && "bg-mint-50 rounded-bl-lg text-ink border border-mint-400/20",
        )}
      >
        {children}
      </div>
    </motion.div>
  );
}

export function StepSpeakBack({
  room,
  onNext,
}: {
  room: Room;
  onNext: (answered: boolean) => void;
}) {
  const [typed, setTyped] = useState("");
  const [sent, setSent] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const recognition = useRecognition();

  const draft = recognition.transcript || typed.trim();

  const send = () => {
    if (draft) setSent(draft);
    setRevealed(true);
  };

  return (
    <div className="flex flex-1 flex-col">
      <Chip tone="coral" className="self-start">
        <MessageSquareQuote className="size-3" /> Étape 6 · Speak Back
      </Chip>
      <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink">
        À toi de répondre
      </h2>
      <p className="mt-1.5 text-ink-soft">
        <span className="font-semibold text-ink">Naturel, pas parfait.</span>{" "}
        Réponds comme dans la vraie vie.
      </p>

      {/* Fil de conversation */}
      <div className="mt-5 space-y-3">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-xs font-semibold text-ink-faint"
        >
          📍 {room.speakBack.situation}
        </motion.p>

        <div className="flex items-end gap-2">
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary-100 text-sm">
            🇺🇸
          </span>
          <div className="min-w-0 flex-1">
            <Bubble side="left" delay={0.15}>
              <span className="flex items-center gap-2">
                <button
                  onClick={() => speakText(room.speakBack.heard)}
                  aria-label="Écouter"
                  className="grid size-7 shrink-0 cursor-pointer place-items-center rounded-full bg-primary-50 text-primary-600"
                >
                  <Volume2 className="size-3.5" strokeWidth={2.2} />
                </button>
                <span className="font-semibold">
                  {room.speakBack.heard}
                </span>
              </span>
            </Bubble>
          </div>
        </div>

        {sent && (
          <Bubble side="right" tone="me">
            <span className="font-semibold">{sent}</span>
          </Bubble>
        )}

        {revealed && (
          <>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="pt-1 text-center text-xs font-semibold text-mint-600"
            >
              Des natifs répondraient :
            </motion.p>
            {room.speakBack.suggestedAnswers.map((suggestion, i) => (
              <div key={suggestion} className="flex items-end gap-2">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-mint-50 text-sm">
                  💬
                </span>
                <div className="min-w-0 flex-1">
                  <Bubble side="left" tone="native" delay={0.35 + i * 0.15}>
                    <span className="flex items-center gap-2">
                      <button
                        onClick={() => speakText(suggestion)}
                        aria-label="Écouter"
                        className="grid size-7 shrink-0 cursor-pointer place-items-center rounded-full bg-white text-mint-600 shadow-soft"
                      >
                        <Volume2 className="size-3.5" strokeWidth={2.2} />
                      </button>
                      <span className="font-semibold">{suggestion}</span>
                    </span>
                  </Bubble>
                </div>
              </div>
            ))}
          </>
        )}
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

          {/* Barre de saisie type messagerie */}
          <div className="mt-5 flex items-center gap-2">
            <input
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && draft && send()}
              placeholder="Type your reply in English…"
              className="card-soft h-12 min-w-0 flex-1 rounded-full px-5 text-[15px] text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={send}
              disabled={!draft}
              aria-label="Envoyer"
              className={cn(
                "grid size-12 shrink-0 place-items-center rounded-full text-white transition-all",
                draft
                  ? "gradient-primary glow-primary cursor-pointer"
                  : "bg-ink/15",
              )}
            >
              <Send className="size-5" strokeWidth={2.2} />
            </motion.button>
          </div>

          <div className="mt-auto pt-5">
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
            transition={{ delay: 0.6 }}
            className="mt-auto flex flex-col pt-5"
          >
            <div className="rounded-2xl bg-mint-50 p-4 text-sm text-mint-600">
              🗣️ Si ta réponse ressemble à l&apos;une d&apos;elles, même de
              loin : c&apos;est gagné.{" "}
              <span className="font-bold">
                Dis-la comme tu la dirais en vrai.
              </span>
            </div>
            <Button
              size="lg"
              fullWidth
              className="mt-4"
              onClick={() => onNext(Boolean(sent))}
            >
              <Mic className="size-4" /> Débloquer mes phrases
            </Button>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
