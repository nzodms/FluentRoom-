"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff, Pause, Play, RotateCcw } from "lucide-react";
import type { DialogueLine } from "@/types/learning";
import {
  isSpeechSynthesisSupported,
  speakText,
  stopSpeaking,
} from "@/lib/speech";
import { Waveform } from "@/components/ui/Waveform";
import { cn } from "@/lib/utils";

interface DialoguePlayerProps {
  dialogue: DialogueLine[];
  /** Transcript masqué par défaut (entraînement de l'oreille). */
  defaultTranscriptVisible?: boolean;
  onListened?: () => void;
  /** Signale que l'utilisateur a ouvert le transcript (badge No Subtitles). */
  onTranscriptShown?: () => void;
}

/**
 * Player premium : lit le dialogue via la synthèse vocale du navigateur,
 * waveform animée, transcript masquable. Si la synthèse est indisponible,
 * bascule en mode lecture avec transcript affiché.
 */
const noopSubscribe = () => () => {};

export function DialoguePlayer({
  dialogue,
  defaultTranscriptVisible = false,
  onListened,
  onTranscriptShown,
}: DialoguePlayerProps) {
  // Support TTS stable après hydratation (true côté serveur pour éviter le flash).
  const ttsSupported = useSyncExternalStore(
    noopSubscribe,
    isSpeechSynthesisSupported,
    () => true,
  );
  const [playing, setPlaying] = useState(false);
  const [currentLine, setCurrentLine] = useState(-1);
  const [finished, setFinished] = useState(false);
  const [nativeSpeed, setNativeSpeed] = useState(false);
  const [transcriptToggled, setTranscriptToggled] = useState(
    defaultTranscriptVisible,
  );
  // Sans audio, le transcript devient le mode de lecture principal.
  const showTranscript = transcriptToggled || !ttsSupported;
  const cancelledRef = useRef(false);

  useEffect(() => {
    return () => {
      cancelledRef.current = true;
      stopSpeaking();
    };
  }, []);

  function playFrom(index: number) {
    if (index >= dialogue.length) {
      setPlaying(false);
      setCurrentLine(-1);
      setFinished(true);
      onListened?.();
      return;
    }
    setCurrentLine(index);
    speakText(dialogue[index].text, {
      rate: nativeSpeed ? 1.12 : 0.95,
      onEnd: () => {
        if (cancelledRef.current) return;
        // Petite respiration entre les répliques.
        setTimeout(() => {
          if (!cancelledRef.current) playFrom(index + 1);
        }, 350);
      },
    });
  }

  const togglePlay = () => {
    if (playing) {
      cancelledRef.current = true;
      stopSpeaking();
      setPlaying(false);
      setCurrentLine(-1);
      return;
    }
    cancelledRef.current = false;
    setFinished(false);
    setPlaying(true);
    playFrom(0);
  };

  const progress =
    currentLine >= 0
      ? (currentLine + 0.5) / dialogue.length
      : finished
        ? 1
        : 0;

  return (
    <div className="card-soft overflow-hidden p-0">
      <div className="p-5">
        <div className="flex items-center gap-4">
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={togglePlay}
            disabled={!ttsSupported}
            aria-label={playing ? "Pause" : "Écouter"}
            className={cn(
              "grid size-14 shrink-0 place-items-center rounded-full text-white transition-shadow cursor-pointer",
              ttsSupported
                ? "gradient-primary shadow-glow"
                : "bg-ink/20 cursor-not-allowed",
            )}
          >
            {playing ? (
              <Pause className="size-5 fill-current" />
            ) : finished ? (
              <RotateCcw className="size-5" strokeWidth={2.5} />
            ) : (
              <Play className="ml-0.5 size-5 fill-current" />
            )}
          </motion.button>
          <div className="min-w-0 flex-1">
            <Waveform playing={playing} progress={progress} />
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs font-medium text-ink-faint">
            {ttsSupported
              ? playing && currentLine >= 0
                ? `${dialogue[currentLine].speaker} parle…`
                : finished
                  ? "Écouté ✓ — réécoute si besoin"
                  : `${dialogue.length} répliques`
              : "Audio non supporté par ce navigateur — lis le dialogue ci-dessous"}
          </p>
          <button
            onClick={() => {
              const next = !showTranscript;
              setTranscriptToggled(next);
              if (next) onTranscriptShown?.();
            }}
            className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-700"
          >
            {showTranscript ? (
              <>
                <EyeOff className="size-3.5" /> Masquer le transcript
              </>
            ) : (
              <>
                <Eye className="size-3.5" /> Afficher le transcript
              </>
            )}
          </button>
        </div>

        {/* Vitesse de lecture */}
        {ttsSupported && (
          <div className="mt-3 flex items-center gap-1 rounded-full bg-ink/5 p-1 text-xs font-bold">
            <button
              onClick={() => setNativeSpeed(false)}
              className={cn(
                "flex-1 cursor-pointer rounded-full py-1.5 transition-all",
                !nativeSpeed
                  ? "bg-white text-ink shadow-soft"
                  : "text-ink-faint",
              )}
            >
              Normal
            </button>
            <button
              onClick={() => setNativeSpeed(true)}
              className={cn(
                "flex-1 cursor-pointer rounded-full py-1.5 transition-all",
                nativeSpeed
                  ? "gradient-primary text-white shadow-glow"
                  : "text-ink-faint",
              )}
            >
              ⚡ Native speed
            </button>
          </div>
        )}
      </div>

      <AnimatePresence initial={false}>
        {showTranscript && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="space-y-3 border-t border-ink/5 bg-cream/60 p-5">
              {dialogue.map((line) => (
                <div
                  key={line.id}
                  className={cn(
                    "rounded-2xl p-3 transition-colors",
                    currentLine === line.id
                      ? "bg-primary-50 ring-1 ring-primary-200"
                      : "bg-white/70",
                  )}
                >
                  <p className="text-xs font-bold uppercase tracking-wide text-primary-600">
                    {line.speaker}
                  </p>
                  <p className="mt-0.5 font-medium text-ink">{line.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
