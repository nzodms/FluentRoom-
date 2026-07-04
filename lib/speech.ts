/**
 * Couche voix du navigateur : synthèse (écoute des dialogues) et
 * reconnaissance (shadowing / speak back), avec détection de support
 * et fallbacks propres. Aucun appel réseau.
 */

export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

/** Voix anglaise préférée : en-US d'abord, sinon n'importe quel en-*. */
function pickEnglishVoice(): SpeechSynthesisVoice | null {
  if (!isSpeechSynthesisSupported()) return null;
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => v.lang === "en-US" && v.localService) ??
    voices.find((v) => v.lang === "en-US") ??
    voices.find((v) => v.lang.startsWith("en")) ??
    null
  );
}

export interface SpeakOptions {
  rate?: number;
  onEnd?: () => void;
}

/** Lit un texte en anglais. Retourne false si la synthèse est indisponible. */
export function speakText(text: string, options: SpeakOptions = {}): boolean {
  if (!isSpeechSynthesisSupported()) return false;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = options.rate ?? 0.95;
  const voice = pickEnglishVoice();
  if (voice) utterance.voice = voice;
  if (options.onEnd) utterance.onend = options.onEnd;
  utterance.onerror = () => options.onEnd?.();
  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopSpeaking(): void {
  if (isSpeechSynthesisSupported()) window.speechSynthesis.cancel();
}

/* ---------- Reconnaissance vocale (Web Speech API) ---------- */

interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: { error: string }) => void) | null;
}

interface SpeechRecognitionEventLike {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

function getRecognitionConstructor(): SpeechRecognitionConstructor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as Record<string, unknown>;
  return (
    (w.SpeechRecognition as SpeechRecognitionConstructor | undefined) ??
    (w.webkitSpeechRecognition as SpeechRecognitionConstructor | undefined) ??
    null
  );
}

export function isSpeechRecognitionSupported(): boolean {
  return getRecognitionConstructor() !== null;
}

export interface RecognitionSession {
  stop: () => void;
}

export interface RecognitionCallbacks {
  onResult: (transcript: string, isFinal: boolean) => void;
  onEnd: () => void;
  onError: (error: string) => void;
}

/**
 * Démarre une écoute micro en anglais.
 * Retourne null si l'API n'est pas supportée (l'UI affiche alors le fallback).
 */
export function startRecognition(
  callbacks: RecognitionCallbacks,
): RecognitionSession | null {
  const Ctor = getRecognitionConstructor();
  if (!Ctor) return null;

  const recognition = new Ctor();
  recognition.lang = "en-US";
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;
  recognition.continuous = false;

  recognition.onresult = (event) => {
    let transcript = "";
    for (let i = 0; i < event.results.length; i++) {
      transcript += event.results[i][0]?.transcript ?? "";
    }
    const last = event.results[event.results.length - 1];
    const isFinal =
      (last as unknown as { isFinal?: boolean }).isFinal ?? false;
    callbacks.onResult(transcript.trim(), isFinal);
  };
  recognition.onend = callbacks.onEnd;
  recognition.onerror = (event) => callbacks.onError(event.error);

  try {
    recognition.start();
  } catch {
    return null;
  }

  return {
    stop: () => {
      try {
        recognition.stop();
      } catch {
        // déjà arrêtée
      }
    },
  };
}
