/**
 * Persistance locale V1 : localStorage namespacé, sûr côté serveur.
 * Supabase pourra remplacer cette couche plus tard sans toucher aux écrans.
 */
const NAMESPACE = "fluentroom:v1";

function key(name: string): string {
  return `${NAMESPACE}:${name}`;
}

export function loadJSON<T>(name: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key(name));
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveJSON<T>(name: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key(name), JSON.stringify(value));
  } catch {
    // Stockage plein ou indisponible : on continue sans bloquer l'app.
  }
}

export function removeItem(name: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key(name));
  } catch {
    // ignore
  }
}

export function clearAll(): void {
  if (typeof window === "undefined") return;
  try {
    const toRemove: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k?.startsWith(NAMESPACE)) toRemove.push(k);
    }
    toRemove.forEach((k) => window.localStorage.removeItem(k));
  } catch {
    // ignore
  }
}
