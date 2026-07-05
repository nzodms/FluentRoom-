"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Zap } from "lucide-react";
import type { UserProgress } from "@/types/learning";
import type { EnergyPurchaseOutcome } from "@/lib/shop";
import {
  ENERGY_PACKS,
  availableFP,
  energyBuysLeftToday,
  fullRechargeUsedToday,
} from "@/lib/shop";
import { MAX_ENERGY, currentEnergy } from "@/lib/energy";
import { CompanionCharacter } from "@/components/companion/CompanionCharacter";
import { getCompanion } from "@/data/companions";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/**
 * Énergie contre FP : un vrai choix, pas un robinet.
 * Limites quotidiennes visibles, jamais d'achat de progression.
 */
export function EnergySection({
  progress,
  onBuy,
}: {
  progress: UserProgress;
  onBuy: (packId: string) => EnergyPurchaseOutcome;
}) {
  const [feedback, setFeedback] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);
  const [shakeId, setShakeId] = useState<string | null>(null);

  const energy = currentEnergy(progress);
  const buysLeft = energyBuysLeftToday(progress);
  const balance = availableFP(progress);
  const companion = getCompanion(progress.companion);

  const buy = (packId: string) => {
    const outcome = onBuy(packId);
    if (outcome.ok) {
      setFeedback({
        ok: true,
        message: `${companion.name} : « Parfait. Une énergie en plus — on l'utilise bien. »`,
      });
    } else {
      setShakeId(packId);
      setTimeout(() => setShakeId(null), 500);
      setFeedback({
        ok: false,
        message:
          outcome.reason === "not-enough"
            ? "Pas assez de FP — une session de plus et c'est bon."
            : outcome.reason === "daily-limit"
              ? "Limite du jour atteinte : l'énergie s'achète avec mesure."
              : outcome.reason === "recharge-used"
                ? "Recharge complète déjà utilisée aujourd'hui."
                : "Ton énergie est déjà au maximum.",
      });
    }
    setTimeout(() => setFeedback(null), 2600);
  };

  return (
    <div data-testid="energy-section">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-lg font-bold tracking-tight text-ink">Énergie</h2>
        <span className="text-xs font-semibold text-ink-faint">
          {buysLeft > 0
            ? `Encore ${buysLeft} achat${buysLeft > 1 ? "s" : ""} aujourd'hui`
            : "Limite du jour atteinte"}
        </span>
      </div>

      {/* Jauge actuelle */}
      <div className="card-soft flex items-center gap-3 p-3.5">
        <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-primary-50 text-primary-600">
          <Zap className="size-5" fill="currentColor" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-ink">
            {energy}/{MAX_ENERGY} énergie
          </p>
          <div className="mt-1.5 flex gap-1">
            {Array.from({ length: MAX_ENERGY }, (_, i) => (
              <span
                key={i}
                className={cn(
                  "h-2 flex-1 rounded-full",
                  i < energy ? "gradient-primary" : "bg-ink/8",
                )}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Packs */}
      <div className="mt-2.5 space-y-2">
        {ENERGY_PACKS.map((pack) => {
          const blocked =
            buysLeft <= 0 ||
            (pack.energy === "full" && fullRechargeUsedToday(progress)) ||
            energy >= MAX_ENERGY;
          const affordable = balance >= pack.price;
          return (
            <motion.div
              key={pack.id}
              animate={shakeId === pack.id ? { x: [0, -7, 7, -4, 4, 0] } : { x: 0 }}
              transition={shakeId === pack.id ? { duration: 0.4 } : undefined}
              className={cn(
                "flex items-center gap-3 rounded-3xl border p-3.5",
                blocked
                  ? "border-ink/5 bg-ink/[0.03] opacity-60"
                  : "border-ink/6 bg-white shadow-soft",
              )}
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-ink">{pack.label}</p>
                <p className="truncate text-xs text-ink-soft">
                  {pack.description}
                </p>
              </div>
              <Button
                size="sm"
                variant={affordable && !blocked ? "primary" : "secondary"}
                disabled={blocked}
                data-testid={`buy-${pack.id}`}
                onClick={() => buy(pack.id)}
              >
                <Zap className="size-3" fill="currentColor" /> {pack.price} FP
              </Button>
            </motion.div>
          );
        })}
      </div>

      {/* Réaction : Nox après achat, message doux sinon */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={cn(
              "mt-2.5 flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5 text-sm font-semibold",
              feedback.ok
                ? "bg-mint-50 text-mint-600"
                : "bg-coral-50 text-coral-600",
            )}
          >
            {feedback.ok && (
              <CompanionCharacter
                companionId={progress.companion}
                size={36}
                expression="happy"
              />
            )}
            <span className="min-w-0 flex-1">{feedback.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
      <p className="mt-2 text-center text-[11px] text-ink-faint">
        L&apos;énergie achète du temps d&apos;apprentissage — jamais la maîtrise.
      </p>
    </div>
  );
}
