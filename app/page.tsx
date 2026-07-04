"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Headphones,
  SearchCheck,
  Repeat2,
  Mic,
  Brain,
  Play,
  Flame,
  Check,
  ArrowRight,
  Sparkles,
  Zap,
} from "lucide-react";
import { BRAND } from "@/lib/brand";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Logo } from "@/components/layout/Logo";
import { videoRooms } from "@/data/videoRooms";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.21, 0.6, 0.35, 1] as const },
};

const method = [
  {
    icon: Headphones,
    title: "Listen",
    text: "Écoute une mini-scène réelle, à vitesse native.",
  },
  {
    icon: SearchCheck,
    title: "Decode",
    text: "Décode les phrases clés, les contractions, les blocs utiles.",
  },
  {
    icon: Repeat2,
    title: "Repeat",
    text: "Répète avec le rythme. Copy the rhythm, not just the words.",
  },
  {
    icon: Mic,
    title: "Speak",
    text: "Réponds à une vraie situation, sans traduire dans ta tête.",
  },
  {
    icon: Brain,
    title: "Remember",
    text: "Retiens les phrases avec une révision espacée intelligente.",
  },
];

export default function LandingPage() {
  return (
    <div className="gradient-hero min-h-dvh">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-ink/5">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
          <Logo />
          <Link href="/onboarding">
            <Button size="sm">Commencer</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-14 md:px-6 md:pb-24 md:pt-24">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Chip tone="primary" className="mb-5">
              <Sparkles className="size-3" /> L&apos;anglais tel qu&apos;il se
              parle vraiment
            </Chip>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="text-[2.6rem] leading-[1.05] font-bold tracking-tight text-ink md:text-6xl"
          >
            Comprends l&apos;anglais réel.
            <br />
            <span className="bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
              Réponds sans bloquer.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="mx-auto mt-5 max-w-lg text-lg text-ink-soft"
          >
            {BRAND.subTagline}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24 }}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link href="/onboarding" className="w-full sm:w-auto">
              <Button size="lg" fullWidth className="sm:w-auto">
                Commencer gratuitement <ArrowRight className="size-4" />
              </Button>
            </Link>
            <span className="text-sm text-ink-faint">
              10 min par jour · Sans carte bancaire
            </span>
          </motion.div>
        </div>

        {/* Aperçu app */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mx-auto mt-14 max-w-sm"
        >
          <div className="card-soft overflow-hidden p-0 shadow-lift">
            <div className="gradient-primary p-5 text-white">
              <div className="flex items-center justify-between text-xs font-semibold opacity-90">
                <span className="inline-flex items-center gap-1">
                  <Flame className="size-3.5" /> 7 jours de suite
                </span>
                <span>Fast Listener · B1</span>
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-widest opacity-80">
                Today&apos;s Room
              </p>
              <h3 className="mt-1 text-2xl font-bold tracking-tight">
                ⏰ Running Late
              </h3>
              <p className="mt-1 text-sm opacity-90">
                Comprendre quelqu&apos;un qui prévient qu&apos;il est en retard
              </p>
            </div>
            <div className="flex items-center justify-between p-5">
              <div className="text-sm text-ink-soft">
                <span className="font-semibold text-ink">8 min</span> · A2/B1 ·
                +5 phrases
              </div>
              <span className="grid size-11 place-items-center rounded-full gradient-primary text-white shadow-glow">
                <Play className="size-4 fill-current" />
              </span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Problème */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-ink md:text-4xl">
            Tu connais des mots, mais tu bloques
            <br className="hidden md:block" /> quand quelqu&apos;un parle vite ?
          </h2>
          <p className="mt-4 text-lg text-ink-soft">
            Normal : on t&apos;a appris l&apos;anglais des manuels, pas
            l&apos;anglais des conversations. Les natifs contractent, avalent,
            enchaînent. <em>« What do you want to do? »</em> devient{" "}
            <em>« whaddya wanna do? »</em> — et ton cerveau décroche.
          </p>
        </motion.div>
        <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-3">
          {[
            {
              emoji: "🧠",
              title: "Tu traduis dans ta tête",
              text: "Et pendant ce temps, la conversation est déjà trois phrases plus loin.",
            },
            {
              emoji: "👂",
              title: "Tu perds les mots connus",
              text: "« Gonna », « kinda », « lemme » : les contractions brouillent tout.",
            },
            {
              emoji: "😶",
              title: "Tu bloques pour répondre",
              text: "Tu cherches la phrase parfaite au lieu de la phrase naturelle.",
            },
          ].map((item, i) => (
            <motion.div key={item.title} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.08 }} className="card-soft p-5">
              <span className="text-2xl">{item.emoji}</span>
              <h3 className="mt-3 font-bold text-ink">{item.title}</h3>
              <p className="mt-1.5 text-sm text-ink-soft">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Méthode */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
          <Chip tone="coral" className="mb-4">
            <Zap className="size-3" /> La méthode
          </Chip>
          <h2 className="text-3xl font-bold tracking-tight text-ink md:text-4xl">
            5 réflexes, chaque jour
          </h2>
          <p className="mt-3 text-lg text-ink-soft">
            Chaque room transforme une mini-scène réelle en entraînement complet
            : ton oreille, ta bouche, tes réflexes.
          </p>
        </motion.div>
        <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {method.map((step, i) => (
            <motion.div
              key={step.title}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.07 }}
              className="card-soft relative p-5"
            >
              <span className="absolute right-4 top-4 text-xs font-bold text-ink-faint">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="grid size-10 place-items-center rounded-2xl bg-primary-50 text-primary-600">
                <step.icon className="size-5" strokeWidth={2.2} />
              </span>
              <h3 className="mt-3 font-bold text-ink">{step.title}</h3>
              <p className="mt-1 text-sm text-ink-soft">{step.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Video Rooms */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
          <Chip tone="primary" className="mb-4">
            Bientôt
          </Chip>
          <h2 className="text-3xl font-bold tracking-tight text-ink md:text-4xl">
            Video Rooms
          </h2>
          <p className="mt-3 text-lg text-ink-soft">
            De vraies vidéos anglaises transformées en leçons : transcript,
            phrases clés, quiz de compréhension. L&apos;immersion, guidée.
          </p>
        </motion.div>
        <div className="mx-auto mt-10 grid max-w-4xl gap-4 md:grid-cols-3">
          {videoRooms.map((video, i) => (
            <motion.div
              key={video.id}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.08 }}
              className="card-soft overflow-hidden p-0"
            >
              <div className="relative flex h-32 items-center justify-center bg-gradient-to-br from-primary-100 to-primary-50">
                <span className="grid size-12 place-items-center rounded-full bg-white/90 text-primary-600 shadow-soft">
                  <Play className="size-5 fill-current" />
                </span>
                <Chip tone="neutral" className="absolute right-3 top-3 bg-white/80">
                  {video.accent} · {video.difficulty}
                </Chip>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-ink">{video.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-ink-soft">
                  {video.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Progression */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <div className="mx-auto grid max-w-4xl items-center gap-10 md:grid-cols-2">
          <motion.div {...fadeUp}>
            <h2 className="text-3xl font-bold tracking-tight text-ink md:text-4xl">
              Une progression que tu peux voir
            </h2>
            <p className="mt-4 text-lg text-ink-soft">
              Streak quotidien, phrases débloquées, scores d&apos;écoute et
              d&apos;oral : chaque session laisse une trace concrète.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Des niveaux motivants : Silent Starter → Fluent Builder",
                "Une banque de phrases qui grandit à chaque room",
                "Une révision espacée pour ne rien oublier",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-ink-soft">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-mint-50 text-mint-600">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div {...fadeUp} className="card-soft p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-ink-faint">
                  Niveau actuel
                </p>
                <p className="mt-1 text-xl font-bold text-ink">Fast Listener</p>
                <p className="text-sm text-ink-faint">Équivalent B1</p>
              </div>
              <span className="grid size-12 place-items-center rounded-2xl bg-gold-50 text-2xl">
                🎧
              </span>
            </div>
            <div className="mt-5 space-y-4">
              {[
                { label: "Compréhension", value: 78, color: "gradient-primary" },
                { label: "Oral", value: 64, color: "gradient-mint" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span className="font-semibold text-ink">{stat.label}</span>
                    <span className="text-ink-faint">{stat.value}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-ink/8">
                    <motion.div
                      className={`h-full rounded-full ${stat.color}`}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${stat.value}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.3 }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 flex gap-2">
              <Chip tone="coral">
                <Flame className="size-3" /> 7 jours
              </Chip>
              <Chip tone="mint">32 phrases</Chip>
              <Chip tone="primary">6 rooms</Chip>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-ink md:text-4xl">
            Commence gratuitement
          </h2>
          <p className="mt-3 text-lg text-ink-soft">
            L&apos;essentiel est gratuit. Le premium arrive pour aller plus loin.
          </p>
        </motion.div>
        <div className="mx-auto mt-10 grid max-w-3xl gap-4 md:grid-cols-2">
          <motion.div {...fadeUp} className="card-soft p-6">
            <h3 className="text-lg font-bold text-ink">Free</h3>
            <p className="mt-1 text-3xl font-bold text-ink">
              0€
              <span className="text-base font-medium text-ink-faint">
                {" "}
                / pour toujours
              </span>
            </p>
            <ul className="mt-5 space-y-2.5 text-sm text-ink-soft">
              {[
                "Rooms quotidiennes essentielles",
                "Phrase Bank et révision espacée",
                "Suivi de progression et streak",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check className="size-4 text-mint-500" strokeWidth={3} />
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/onboarding" className="mt-6 block">
              <Button variant="secondary" fullWidth>
                Commencer
              </Button>
            </Link>
          </motion.div>
          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.1 }}
            className="relative overflow-hidden rounded-3xl gradient-primary p-6 text-white shadow-lift"
          >
            <Chip className="absolute right-4 top-4 bg-white/15 text-white">
              Bientôt
            </Chip>
            <h3 className="text-lg font-bold">Premium</h3>
            <p className="mt-1 text-3xl font-bold">
              6,99€
              <span className="text-base font-medium opacity-75"> / mois</span>
            </p>
            <ul className="mt-5 space-y-2.5 text-sm opacity-95">
              {[
                "Toutes les rooms, sans limite",
                "Video Rooms : vraies vidéos décodées",
                "Speak practice avancé",
                "Statistiques détaillées",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check className="size-4" strokeWidth={3} />
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/onboarding" className="mt-6 block">
              <Button
                fullWidth
                className="bg-white !text-primary-700 shadow-none hover:shadow-none"
                style={{ background: "white" }}
              >
                Rejoindre la liste d&apos;attente
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA final */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <motion.div
          {...fadeUp}
          className="relative overflow-hidden rounded-[2.25rem] gradient-primary px-6 py-14 text-center text-white shadow-lift"
        >
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Prêt à comprendre l&apos;anglais réel ?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-lg opacity-90">
            Première room en 2 minutes. You&apos;re building reflexes.
          </p>
          <Link href="/onboarding" className="mt-7 inline-block">
            <Button
              size="lg"
              className="bg-white !text-primary-700"
              style={{ background: "white" }}
            >
              Commencer gratuitement <ArrowRight className="size-4" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-ink/5">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row md:px-6">
          <Logo />
          <p className="text-sm text-ink-faint">
            © {new Date().getFullYear()} {BRAND.name} · L&apos;anglais réel,
            10 minutes par jour.
          </p>
          <a
            href={`mailto:${BRAND.supportEmail}`}
            className="text-sm font-semibold text-primary-600 hover:text-primary-700"
          >
            {BRAND.supportEmail}
          </a>
        </div>
      </footer>
    </div>
  );
}
