"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  isSpeechRecognitionSupported,
  startRecognition,
  type RecognitionSession,
} from "./speech";

const noopSubscribe = () => () => {};

/** Support micro, stable après hydratation (false côté serveur). */
export function useSpeechRecognitionSupport(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    isSpeechRecognitionSupported,
    () => false,
  );
}

interface UseRecognitionOptions {
  /** Appelé avec la transcription finale quand l'écoute se termine. */
  onFinish?: (transcript: string) => void;
}

/**
 * Hook micro : démarre/arrête la reconnaissance vocale anglaise.
 * `supported === false` => l'UI affiche le fallback "Mark as practiced".
 */
export function useRecognition(options: UseRecognitionOptions = {}) {
  const supported = useSpeechRecognitionSupport();
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const sessionRef = useRef<RecognitionSession | null>(null);
  const transcriptRef = useRef("");
  const onFinishRef = useRef(options.onFinish);

  useEffect(() => {
    onFinishRef.current = options.onFinish;
  });

  useEffect(() => {
    return () => sessionRef.current?.stop();
  }, []);

  const start = useCallback(() => {
    setTranscript("");
    transcriptRef.current = "";
    setError(null);
    const session = startRecognition({
      onResult: (text) => {
        transcriptRef.current = text;
        setTranscript(text);
      },
      onEnd: () => {
        setListening(false);
        if (transcriptRef.current) {
          onFinishRef.current?.(transcriptRef.current);
        }
      },
      onError: (err) => {
        setError(err);
        setListening(false);
      },
    });
    if (!session) return;
    sessionRef.current = session;
    setListening(true);
  }, []);

  const stop = useCallback(() => {
    sessionRef.current?.stop();
    setListening(false);
  }, []);

  return { supported, listening, transcript, error, start, stop, setTranscript };
}
