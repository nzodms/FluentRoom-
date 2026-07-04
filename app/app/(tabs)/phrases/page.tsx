"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookMarked, Lock, Search } from "lucide-react";
import type { PhraseStatus } from "@/types/learning";
import { allPhrases, phraseCategories } from "@/data/phrases";
import { useProgress } from "@/lib/useProgress";
import { PhraseCard } from "@/components/phrase/PhraseCard";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { cn } from "@/lib/utils";

const statusFilters: Array<{ id: PhraseStatus | "all"; label: string }> = [
  { id: "all", label: "All" },
  { id: "new", label: "New" },
  { id: "review", label: "To review" },
  { id: "mastered", label: "Mastered" },
];

export default function PhrasesPage() {
  const { progress, ready, practice } = useProgress();
  const [statusFilter, setStatusFilter] = useState<PhraseStatus | "all">("all");
  const [category, setCategory] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const unlockedIds = useMemo(
    () => new Set(Object.keys(progress.phrases)),
    [progress.phrases],
  );

  const unlocked = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allPhrases.filter((phrase) => {
      if (!unlockedIds.has(phrase.id)) return false;
      const state = progress.phrases[phrase.id];
      if (statusFilter !== "all") {
        // "To review" englobe seen + review pour rester simple.
        if (statusFilter === "review") {
          if (state.status !== "review" && state.status !== "seen") return false;
        } else if (state.status !== statusFilter) {
          return false;
        }
      }
      if (category && phrase.category !== category) return false;
      if (
        q &&
        !phrase.english.toLowerCase().includes(q) &&
        !phrase.french.toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [query, statusFilter, category, unlockedIds, progress.phrases]);

  const lockedCount = allPhrases.length - unlockedIds.size;

  return (
    <div className={cn("space-y-5 transition-opacity", !ready && "opacity-0")}>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">
          Phrase Bank
        </h1>
        <p className="text-sm text-ink-soft">
          {`${unlockedIds.size} phrase${unlockedIds.size > 1 ? "s" : ""} débloquée${unlockedIds.size > 1 ? "s" : ""} sur ${allPhrases.length} — ta collection d'anglais réel`}
        </p>
      </div>

      {/* Recherche */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink-faint" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Chercher une phrase…"
          className="card-soft w-full py-3.5 pl-11 pr-4 text-[15px] text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-primary-400"
        />
      </div>

      {/* Filtres statut */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {statusFilters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setStatusFilter(filter.id)}
            className={cn(
              "shrink-0 cursor-pointer rounded-full px-4 py-2 text-sm font-semibold transition-all",
              statusFilter === filter.id
                ? "gradient-primary text-white shadow-glow"
                : "bg-white text-ink-soft border border-ink/8 hover:border-primary-200",
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Catégories */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {phraseCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(category === cat.id ? null : cat.id)}
            className={cn(
              "shrink-0 cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all",
              category === cat.id
                ? "bg-ink text-white"
                : "bg-white text-ink-soft border border-ink/8",
            )}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Liste */}
      {unlockedIds.size === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-soft flex flex-col items-center p-8 text-center"
        >
          <span className="grid size-16 place-items-center rounded-3xl bg-primary-50 text-primary-600">
            <BookMarked className="size-7" />
          </span>
          <h2 className="mt-4 text-lg font-bold text-ink">
            Ta banque est prête à se remplir
          </h2>
          <p className="mt-1.5 max-w-xs text-sm text-ink-soft">
            Chaque room terminée débloque 5 phrases réelles. Elles arrivent
            ici, avec exemples et révision espacée.
          </p>
          <Link href="/app/today" className="mt-5">
            <Button>Faire ma première room</Button>
          </Link>
        </motion.div>
      ) : unlocked.length === 0 ? (
        <div className="card-soft p-6 text-center text-sm text-ink-soft">
          Aucune phrase ne correspond à ces filtres. Essaie « All » ou vide la
          recherche.
        </div>
      ) : (
        <div className="space-y-3">
          {unlocked.map((phrase, i) => (
            <motion.div
              key={phrase.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.35 }}
            >
              <PhraseCard
                phrase={phrase}
                status={progress.phrases[phrase.id]?.status ?? "new"}
                onPracticed={(score, transcript, manual) =>
                  practice({
                    phraseId: phrase.id,
                    score,
                    transcript,
                    markedManually: manual,
                    at: new Date().toISOString(),
                  })
                }
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Teaser phrases restantes */}
      {lockedCount > 0 && unlockedIds.size > 0 && (
        <Link href="/app/today" className="block">
          <div className="card-soft flex items-center gap-3 p-4 opacity-80 transition-opacity hover:opacity-100">
            <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-ink/5 text-ink-faint">
              <Lock className="size-4" />
            </span>
            <div className="flex-1">
              <p className="font-bold text-ink">
                {lockedCount} phrases encore verrouillées
              </p>
              <p className="text-sm text-ink-soft">
                Termine des rooms pour les débloquer.
              </p>
            </div>
            <Chip tone="primary">Go</Chip>
          </div>
        </Link>
      )}
    </div>
  );
}
