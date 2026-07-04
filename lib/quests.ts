import type { UserProgress } from "@/types/learning";
import { todayKey } from "./utils";
import { getDailySteps } from "./progress";

export interface Quest {
  id: string;
  /** Clé de réclamation unique (jour ou semaine). */
  key: string;
  scope: "daily" | "weekly";
  emoji: string;
  label: string;
  current: number;
  target: number;
  xp: number;
  done: boolean;
  claimed: boolean;
}

/** Lundi de la semaine courante (clé hebdo). */
function weekKey(): string {
  const d = new Date();
  const day = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - day);
  return todayKey(d);
}

function thisWeekDays(): string[] {
  const start = new Date(`${weekKey()}T00:00:00`);
  const days: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    days.push(todayKey(d));
  }
  return days;
}

/** Quêtes du jour + de la semaine, avec progression calculée. */
export function computeQuests(progress: UserProgress): Quest[] {
  const today = todayKey();
  const week = thisWeekDays();
  const steps = getDailySteps(progress);
  const claimed = new Set(progress.claimedQuests ?? []);

  const phrasesToday = Object.values(progress.phrases).filter(
    (p) => p.unlockedAt.slice(0, 10) === today,
  ).length;
  const practiceToday = progress.practiceLog.filter(
    (p) => p.at.slice(0, 10) === today,
  ).length;
  const roomsThisWeek = Object.values(progress.completedRooms).filter((r) =>
    week.includes(r.completedAt.slice(0, 10)),
  ).length;
  const practiceThisWeek = progress.practiceLog.filter((p) =>
    week.includes(p.at.slice(0, 10)),
  ).length;
  const activeDays = week.filter((d) => (progress.activity[d] ?? 0) > 0).length;

  const defs: Array<Omit<Quest, "key" | "done" | "claimed">> = [
    {
      id: "room",
      scope: "daily",
      emoji: "🚪",
      label: "Terminer la room du jour",
      current: steps.includes("room") ? 1 : 0,
      target: 1,
      xp: 10,
    },
    {
      id: "phrases-3",
      scope: "daily",
      emoji: "💎",
      label: "Débloquer 3 phrases",
      current: Math.min(phrasesToday, 3),
      target: 3,
      xp: 10,
    },
    {
      id: "speak-1",
      scope: "daily",
      emoji: "🎙️",
      label: "Parler à voix haute 1 fois",
      current: Math.min(practiceToday + (steps.includes("room") ? 1 : 0), 1),
      target: 1,
      xp: 10,
    },
    {
      id: "review-5",
      scope: "daily",
      emoji: "🔁",
      label: "Réviser 5 phrases",
      current: steps.includes("review") ? 5 : 0,
      target: 5,
      xp: 10,
    },
    {
      id: "rooms-3",
      scope: "weekly",
      emoji: "🏠",
      label: "3 rooms cette semaine",
      current: Math.min(roomsThisWeek, 3),
      target: 3,
      xp: 25,
    },
    {
      id: "practice-10",
      scope: "weekly",
      emoji: "🗣️",
      label: "10 phrases pratiquées",
      current: Math.min(practiceThisWeek, 10),
      target: 10,
      xp: 25,
    },
    {
      id: "days-5",
      scope: "weekly",
      emoji: "🔥",
      label: "5 jours actifs",
      current: Math.min(activeDays, 5),
      target: 5,
      xp: 30,
    },
  ];

  return defs.map((def) => {
    const key =
      def.scope === "daily" ? `d:${today}:${def.id}` : `w:${weekKey()}:${def.id}`;
    return {
      ...def,
      key,
      done: def.current >= def.target,
      claimed: claimed.has(key),
    };
  });
}
