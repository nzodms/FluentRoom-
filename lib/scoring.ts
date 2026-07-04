/**
 * Scoring heuristique V1 : on mesure la présence des mots attendus
 * dans la transcription, pas la qualité de l'accent.
 * "Natural, not perfect."
 */

const CONTRACTION_MAP: Record<string, string> = {
  "i'm": "im",
  "i'll": "ill",
  "don't": "dont",
  "can't": "cant",
  "won't": "wont",
  "that'll": "thatll",
  "that's": "thats",
  "it's": "its",
  "you're": "youre",
  "we're": "were",
  "let's": "lets",
  "how's": "hows",
  "there's": "theres",
};

export function normalizeText(text: string): string {
  let normalized = text.toLowerCase().trim();
  for (const [from, to] of Object.entries(CONTRACTION_MAP)) {
    normalized = normalized.split(from).join(to);
  }
  return normalized
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const STOP_WORDS = new Set(["a", "an", "the", "to", "of", "and", "or", "so"]);

function significantWords(text: string): string[] {
  return normalizeText(text)
    .split(" ")
    .filter((word) => word.length > 0 && !STOP_WORDS.has(word));
}

/**
 * Score 0–100 : proportion des mots attendus retrouvés dans la transcription.
 * Tolère les variations en comparant aussi les préfixes (running / runnin).
 */
export function matchScore(expected: string, transcript: string): number {
  const expectedWords = significantWords(expected);
  if (expectedWords.length === 0) return 0;
  const heard = new Set(significantWords(transcript));
  if (heard.size === 0) return 0;

  let matched = 0;
  for (const word of expectedWords) {
    if (heard.has(word)) {
      matched += 1;
      continue;
    }
    const partial = Array.from(heard).some(
      (h) =>
        (h.length >= 4 && word.startsWith(h)) ||
        (word.length >= 4 && h.startsWith(word)),
    );
    if (partial) matched += 0.5;
  }

  return Math.round((matched / expectedWords.length) * 100);
}

/** Feedback court et motivant selon le score. */
export function scoreFeedback(score: number): string {
  if (score >= 85) return "Excellent. On dirait presque un natif.";
  if (score >= 65) return "Très bien ! Le rythme est là.";
  if (score >= 40) return "Pas mal — réécoute et attrape le rythme.";
  return "C'est un début. Copy the rhythm, not just the words.";
}
