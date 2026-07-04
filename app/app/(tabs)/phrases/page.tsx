"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { BookMarked, Lock, Play, Search, Sparkles } from "lucide-react";
import type { Phrase, PhraseStatus } from "@/types/learning";
import { allPhrases, phraseCategories } from "@/data/phrases";
import { useProgress } from "@/lib/useProgress";
import { PhraseCard } from "@/components/phrase/PhraseCard";
import { ReviewSession } from "@/components/phrase/ReviewSession";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { cn, todayKey } from "@/lib/utils";

const statusFilters: Array<{ id: PhraseStatus | "all"; label: string }> = [
  { id: "all", label: "All" },
  { id: "new", label: "New" },
  { id: "review", label: "To review" },
  { id: "mastered", label: "Mastered" },
];

export default function PhrasesPage() {
  const { progress, ready, practice, finishReviewSession } = useProgress();
  const [statusFilter, setStatusFilter] = useState<PhraseStatus | "all">("all");
  const [category, setCategory] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [reviewOpen, setReviewOpen] = useState(false);

  // Ouvre la review session si on arrive avec ?review=1 (depuis le Daily Path).
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      new URLSearchParams(window.location.search).get("review") !== "1"
    ) {
      return;
    }
    const t = setTimeout(() => setReviewOpen(true), 200);
    return () => clearTimeout(t);
  }, []);

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

  // Compteurs du "trésor".
  const counts = useMemo(() => {
    const states = Object.entries(progress.phrases);
    const today = todayKey();
    return {
      today: states.filter(([, s]) => s.unlockedAt.slice(0, 10) === today)
        .length,
      toReview: states.filter(
        ([, s]) => s.status === "seen" || s.status === "new",
      ).length,
      almost: states.filter(([, s]) => s.status === "review").length,
      mastered: states.filter(([, s]) => s.status === "mastered").length,
    };
  }, [progress.phrases]);

  // Phrases de la session : priorité aux non maîtrisées, les plus anciennes d'abord.
  const reviewPhrases: Phrase[] = useMemo(() => {
    const entries = Object.entries(progress.phrases)
      .sort(([, a], [, b]) => {
        const rank = (s: PhraseStatus) =>
          s === "seen" ? 0 : s === "review" ? 1 : s === "new" ? 2 : 3;
        return (
          rank(a.status) - rank(b.status) ||
          (a.lastReviewedAt ?? "").localeCompare(b.lastReviewedAt ?? "")
        );
      })
      .slice(0, 5)
      .map(([id]) => allPhrases.find((p) => p.id === id))
      .filter((p): p is Phrase => Boolean(p));
    return entries;
  }, [progress.phrases]);

  return (
    <div className={cn("space-y-5 transition-opacity", !ready && "opacity-0")}>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">
          Phrase Bank
        </h1>
        <p className="text-sm text-ink-soft">
          {`${unlockedIds.size} phrase${unlockedIds.size > 1 ? "s" : ""} sur ${allPhrases.length} — ton capital d'anglais réel`}
        </p>
      </div>

      {/* Trésor : compteurs */}
      {unlockedIds.size > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {[
            { value: counts.today, label: "Aujourd'hui", tone: "text-coral-500" },
            { value: counts.toReview, label: "À revoir", tone: "text-primary-600" },
            { value: counts.almost, label: "Presque", tone: "text-gold-500" },
            { value: counts.mastered, label: "Mastered", tone: "text-mint-600" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card-soft p-2.5 text-center"
            >
              <p className={cn("text-xl font-bold", stat.tone)}>{stat.value}</p>
              <p className="text-[10px] font-semibold text-ink-faint">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Review session CTA */}
      {reviewPhrases.length > 0 && (
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setReviewOpen(true)}
          className="w-full cursor-pointer overflow-hidden rounded-3xl gradient-primary p-4 text-left text-white shadow-lift"
        >
          <div className="flex items-center gap-3.5">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white/15">
              <Play className="size-5 fill-current" />
            </span>
            <div className="flex-1">
              <p className="font-bold">Review session · 1 min</p>
              <p className="text-sm opacity-85">
                {Math.min(reviewPhrases.length, 5)} phrases à ancrer. « Je la
                connais » ou « à revoir » — c&apos;est tout.
              </p>
            </div>
            <Chip className="bg-white/15 text-white">
              <Sparkles className="size-3" /> +FP
            </Chip>
          </div>
        </motion.button>
      )}

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

      {/* Catégories avec progression */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {phraseCategories.map((cat) => {
          const total = allPhrases.filter((p) => p.category === cat.id).length;
          const have = allPhrases.filter(
            (p) => p.category === cat.id && unlockedIds.has(p.id),
          ).length;
          return (
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
              <span
                className={cn(
                  "ml-1.5",
                  category === cat.id ? "text-white/70" : "text-ink-faint",
                )}
              >
                {have}/{total}
              </span>
            </button>
          );
        })}
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
            Chaque room et chaque leçon débloque des phrases réelles. Elles
            arrivent ici, avec exemples et révision espacée.
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
                state={progress.phrases[phrase.id]}
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
                Termine des rooms et des leçons pour les débloquer.
              </p>
            </div>
            <Chip tone="primary">Go</Chip>
          </div>
        </Link>
      )}

      {/* Review session overlay */}
      <AnimatePresence>
        {reviewOpen && reviewPhrases.length > 0 && (
          <ReviewSession
            phrases={reviewPhrases}
            onFinish={finishReviewSession}
            onClose={() => setReviewOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
