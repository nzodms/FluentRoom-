"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Crown, RotateCcw } from "lucide-react";
import { getLevelForXp } from "@/data/levels";
import { useProgress } from "@/lib/useProgress";
import { MAX_SHIELDS } from "@/lib/chests";
import { AvatarCharacter } from "@/components/avatar/AvatarCharacter";
import { AvatarCustomizer } from "@/components/avatar/AvatarCustomizer";
import { BRAND } from "@/lib/brand";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const goalLabels: Record<string, string> = {
  videos: "Comprendre les vidéos",
  travel: "Voyager",
  natives: "Parler avec des natifs",
  speaking: "Améliorer mon oral",
  basics: "Reprendre les bases",
};

export default function SettingsPage() {
  const { progress, ready, reset, setAvatar } = useProgress();
  const [confirmReset, setConfirmReset] = useState(false);
  const level = getLevelForXp(progress.xp);

  return (
    <div className={cn("space-y-5 transition-opacity", !ready && "opacity-0")}>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">Profil</h1>
        <p className="text-sm text-ink-soft">Ton compte et tes préférences.</p>
      </div>

      {/* Profil + personnage */}
      <Card animate className="flex items-center gap-4 p-5">
        <AvatarCharacter config={progress.avatar} size={64} />
        <div className="min-w-0 flex-1">
          <p className="text-lg font-bold text-ink">
            {progress.onboarding?.profileName ?? "Explorer"}
          </p>
          <p className="text-sm text-ink-soft">
            {level.name} · {level.cefr} · série de {progress.streak}
          </p>
        </div>
        <Chip tone="primary">{progress.xp} FP</Chip>
      </Card>

      {/* Streak shields */}
      <Card animate delay={0.04} className="flex items-center gap-3.5 p-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary-50 text-primary-600">
          🛡️
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-ink">
            Streak Shields · {progress.streakShields ?? 0}/{MAX_SHIELDS}
          </p>
          <p className="text-xs text-ink-soft">
            Protège un jour manqué. Se gagne dans les coffres.
          </p>
        </div>
        <div className="flex gap-1.5">
          {Array.from({ length: MAX_SHIELDS }, (_, i) => (
            <span
              key={i}
              className={
                i < (progress.streakShields ?? 0)
                  ? "text-lg"
                  : "text-lg opacity-25 grayscale"
              }
            >
              🛡️
            </span>
          ))}
        </div>
      </Card>

      {/* Personnalisation du personnage */}
      <div>
        <h2 className="mb-2.5 text-lg font-bold tracking-tight text-ink">
          Ton personnage
        </h2>
        <AvatarCustomizer
          config={progress.avatar}
          unlockedItems={progress.unlockedItems ?? []}
          onChange={setAvatar}
        />
      </div>

      {/* Historique des récompenses */}
      {(progress.rewardHistory ?? []).length > 0 && (
        <Card animate delay={0.08} className="p-4">
          <p className="text-sm font-bold text-ink">🎁 Derniers coffres</p>
          <div className="mt-2.5 space-y-2">
            {[...(progress.rewardHistory ?? [])].reverse().slice(0, 5).map((entry, i) => (
              <div key={`${entry.at}-${i}`} className="flex items-center gap-2.5">
                <span className="size-1.5 shrink-0 rounded-full bg-gold-400" />
                <p className="min-w-0 flex-1 truncate text-sm text-ink-soft">
                  {entry.label}
                </p>
                <Chip tone={entry.rarity === "common" ? "neutral" : entry.rarity === "rare" ? "primary" : "gold"}>
                  {entry.rarity}
                </Chip>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Préférences */}
      <Card animate delay={0.08} className="divide-y divide-ink/5 p-0">
        <SettingRow
          label="Objectif"
          value={
            progress.onboarding
              ? goalLabels[progress.onboarding.goal]
              : "À définir dans l'onboarding"
          }
        />
        <SettingRow
          label="Objectif quotidien"
          value={
            progress.onboarding
              ? `${progress.onboarding.dailyMinutes} min / jour`
              : "10 min / jour"
          }
        />
        <SettingRow label="Langue de l'interface" value="Français 🇫🇷" />
        <SettingRow
          label="Niveau actuel"
          value={`${level.name} (${level.cefr})`}
        />
      </Card>

      {/* Premium teaser */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="overflow-hidden rounded-[1.75rem] gradient-primary p-5 text-white shadow-lift"
      >
        <div className="flex items-center gap-2">
          <Crown className="size-5" />
          <p className="text-lg font-bold">{BRAND.name} Premium</p>
          <Chip className="ml-auto bg-white/15 text-white">Bientôt</Chip>
        </div>
        <ul className="mt-4 space-y-2 text-sm opacity-95">
          {[
            "Toutes les rooms, sans limite",
            "Video Rooms : vraies vidéos décodées",
            "Speak practice avancé",
            "Statistiques détaillées",
          ].map((item) => (
            <li key={item} className="flex items-center gap-2">
              <Check className="size-4" strokeWidth={3} /> {item}
            </li>
          ))}
        </ul>
        <Button
          fullWidth
          className="mt-5 bg-white !text-primary-700 shadow-none"
          style={{ background: "white" }}
        >
          Rejoindre la liste d&apos;attente
        </Button>
      </motion.div>

      {/* Reset */}
      <Card animate delay={0.2} className="p-5">
        <p className="font-bold text-ink">Zone sensible</p>
        <p className="mt-1 text-sm text-ink-soft">
          Réinitialise toute ta progression : rooms, phrases, streak, badges.
          Irréversible.
        </p>
        {!confirmReset ? (
          <Button
            variant="outline"
            size="sm"
            className="mt-4 !border-coral-100 !text-coral-600 hover:!border-coral-400 hover:!bg-coral-50"
            onClick={() => setConfirmReset(true)}
          >
            <RotateCcw className="size-3.5" /> Reset progress
          </Button>
        ) : (
          <div className="mt-4 flex gap-2">
            <Button
              variant="coral"
              size="sm"
              onClick={() => {
                reset();
                setConfirmReset(false);
              }}
            >
              Oui, tout effacer
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setConfirmReset(false)}
            >
              Annuler
            </Button>
          </div>
        )}
      </Card>

      <p className="pb-4 text-center text-xs text-ink-faint">
        {BRAND.name} v1.0 · Fait avec ❤️ pour les francophones qui veulent
        comprendre l&apos;anglais réel.
      </p>
    </div>
  );
}

function SettingRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-5 py-4">
      <p className="text-sm font-semibold text-ink-soft">{label}</p>
      <p className="text-sm font-bold text-ink">{value}</p>
    </div>
  );
}
