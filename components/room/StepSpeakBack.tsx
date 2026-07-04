"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mic, Send, Volume2 } from "lucide-react";
import type { Room } from "@/types/learning";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { LearningScreen } from "@/components/session/LearningScreen";
import { LearningGlyph } from "@/components/icons/learning-icons";
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
          "max-w-[85%] rounded-3xl px-4 py-2.5 text-[15px] shadow-soft",
          tone === "me" && "gradient-primary rounded-br-lg text-white",
          tone === "other" &&
            "bg-white rounded-bl-lg text-ink border border-ink/5",
          tone === "native" &&
            "bg-mint-50 rounded-bl-lg text-ink border border-mint-400/20",
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
    <LearningScreen
      label={
        <Chip tone="mint">
          <LearningGlyph name="speak" className="size-3" /> Speak Back
        </Chip>
      }
      title="À toi de répondre"
      subtitle="Naturel, pas parfait. Réponds sans traduire."
      action={
        !revealed ? (
          <>
            <div className="flex items-center gap-2">
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
            <Button variant="ghost" fullWidth onClick={() => setRevealed(true)}>
              Je bloque, montre-moi les réponses
            </Button>
          </>
        ) : (
          <Button size="lg" fullWidth onClick={() => onNext(Boolean(sent))}>
            <Mic className="size-4" /> Recap challenge
          </Button>
        )
      }
    >
      {/* Fil de conversation */}
      <div className="space-y-2.5">
        <p className="text-center text-xs font-semibold text-ink-faint">
          📍 {room.speakBack.situation}
        </p>

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
                <span className="font-semibold">{room.speakBack.heard}</span>
              </span>
            </Bubble>
          </div>
        </div>

        {sent && (
          <Bubble side="right" tone="me">
            <span className="font-semibold">{sent}</span>
          </Bubble>
        )}

        {revealed ? (
          <>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="pt-0.5 text-center text-xs font-semibold text-mint-600"
            >
              Des natifs répondraient :
            </motion.p>
            {room.speakBack.suggestedAnswers.map((suggestion, i) => (
              <div key={suggestion} className="flex items-end gap-2">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-mint-50 text-sm">
                  💬
                </span>
                <div className="min-w-0 flex-1">
                  <Bubble side="left" tone="native" delay={0.3 + i * 0.14}>
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
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="rounded-2xl bg-mint-50 p-3 text-center text-sm font-semibold text-mint-600"
            >
              Si ta réponse leur ressemble, même de loin : c&apos;est gagné. 🗣️
            </motion.p>
          </>
        ) : (
          <div className="flex flex-col items-center pt-2">
            {recognition.supported && (
              <>
                <MicRecorder
                  listening={recognition.listening}
                  supported={recognition.supported}
                  onStart={recognition.start}
                  onStop={recognition.stop}
                  size="md"
                />
                <p className="mt-2 text-xs font-medium text-ink-faint">
                  {recognition.listening
                    ? "Je t'écoute…"
                    : "Réponds à voix haute, ou écris en bas"}
                </p>
              </>
            )}
            {recognition.transcript && (
              <p className="mt-1.5 rounded-xl bg-ink/5 px-3 py-1.5 text-sm italic text-ink-soft">
                “{recognition.transcript}”
              </p>
            )}
          </div>
        )}
      </div>
    </LearningScreen>
  );
}
