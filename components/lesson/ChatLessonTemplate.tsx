"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Volume2 } from "lucide-react";
import { speakText } from "@/lib/speech";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { LearningScreen } from "@/components/session/LearningScreen";
import { cn } from "@/lib/utils";
import type { StepProps } from "./lesson-steps";

/**
 * Template "chat" : la leçon est une conversation avec Alex,
 * un ami natif. Tout passe par des bulles de messages et des
 * réponses rapides — comme une vraie discussion.
 */

/* ---------- Primitives de conversation ---------- */

function AlexAvatar() {
  return (
    <span className="grid size-7 shrink-0 place-items-center rounded-full gradient-primary text-[11px] font-bold text-white">
      A
    </span>
  );
}

function Bubble({
  from,
  children,
  onSpeak,
}: {
  from: "alex" | "me" | "note";
  children: React.ReactNode;
  onSpeak?: () => void;
}) {
  if (from === "note") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-auto max-w-[85%] rounded-2xl bg-gold-50 px-3.5 py-2 text-center text-xs font-semibold text-gold-500"
      >
        {children}
      </motion.div>
    );
  }
  const me = from === "me";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 380, damping: 26 }}
      className={cn("flex items-end gap-2", me && "flex-row-reverse")}
    >
      {!me && <AlexAvatar />}
      <div
        className={cn(
          "max-w-[80%] rounded-3xl px-4 py-2.5 text-[15px] font-semibold",
          me
            ? "rounded-br-lg gradient-primary text-white shadow-glow"
            : "rounded-bl-lg bg-white text-ink shadow-soft",
        )}
      >
        {children}
      </div>
      {!me && onSpeak && (
        <button
          onClick={onSpeak}
          aria-label="Écouter le message"
          className="grid size-7 shrink-0 cursor-pointer place-items-center rounded-full bg-primary-50 text-primary-600"
        >
          <Volume2 className="size-3.5" />
        </button>
      )}
    </motion.div>
  );
}

function TypingDots() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-end gap-2"
    >
      <AlexAvatar />
      <div className="flex gap-1 rounded-3xl rounded-bl-lg bg-white px-4 py-3.5 shadow-soft">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="size-1.5 rounded-full bg-ink/30"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
    </motion.div>
  );
}

function ChatFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col gap-3 rounded-3xl bg-cream/60 p-1">
      <div className="flex items-center gap-2 px-2 pt-1">
        <AlexAvatar />
        <div>
          <p className="text-sm font-bold text-ink">Alex</p>
          <p className="text-[10px] font-semibold text-mint-500">en ligne</p>
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-end gap-2.5 px-1 pb-1">
        {children}
      </div>
    </div>
  );
}

/** Chips de réponse rapide, style messagerie. */
function ReplyChips({
  options,
  onPick,
  disabled,
}: {
  options: string[];
  onPick: (index: number) => void;
  disabled?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap justify-end gap-2 pt-1"
    >
      {options.map((option, i) => (
        <motion.button
          key={option}
          whileTap={!disabled ? { scale: 0.96 } : undefined}
          disabled={disabled}
          onClick={() => onPick(i)}
          className="cursor-pointer rounded-full border-2 border-primary-300 bg-white px-4 py-2 text-sm font-bold text-primary-600 transition-colors hover:bg-primary-50 disabled:opacity-50"
        >
          {option}
        </motion.button>
      ))}
    </motion.div>
  );
}

/* ---------- 1 · Intro : Alex t'écrit ---------- */

export function StepChatIntro({ lesson, onNext }: StepProps) {
  const messages = [
    `Hey ! Aujourd'hui je t'apprends un bloc que j'utilise tout le temps : « ${lesson.structure} » ${lesson.emoji}`,
    lesson.explanation,
  ];
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (shown >= messages.length) return;
    const t = setTimeout(() => setShown((s) => s + 1), shown === 0 ? 900 : 1700);
    return () => clearTimeout(t);
  }, [shown, messages.length]);

  const done = shown >= messages.length;

  return (
    <LearningScreen
      label={<Chip tone="primary">💬 Leçon conversation</Chip>}
      title=""
      action={
        <Button size="lg" fullWidth disabled={!done} onClick={onNext}>
          {done ? "Répondre à Alex" : "Alex écrit…"}
        </Button>
      }
    >
      <ChatFrame>
        {messages.slice(0, shown).map((message) => (
          <Bubble key={message} from="alex">
            {message}
          </Bubble>
        ))}
        <AnimatePresence>{!done && <TypingDots />}</AnimatePresence>
      </ChatFrame>
    </LearningScreen>
  );
}

/* ---------- 2 · Alex envoie ses exemples ---------- */

export function StepChatExamples({ lesson, onNext }: StepProps) {
  const examples = lesson.examples.slice(0, 4);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (shown >= examples.length) return;
    const t = setTimeout(() => {
      setShown((s) => s + 1);
      speakText(examples[shown].english);
    }, shown === 0 ? 800 : 1900);
    return () => clearTimeout(t);
  }, [shown, examples]);

  const done = shown >= examples.length;

  return (
    <LearningScreen
      label={
        <Chip tone="primary">
          💬 Alex t&apos;envoie {examples.length} vrais messages
        </Chip>
      }
      title=""
      action={
        <Button size="lg" fullWidth disabled={!done} onClick={onNext}>
          {done ? "J'ai tout lu 👀" : "Messages en cours…"}
        </Button>
      }
    >
      <ChatFrame>
        {examples.slice(0, shown).map((example) => (
          <div key={example.english} className="space-y-1">
            <Bubble from="alex" onSpeak={() => speakText(example.english)}>
              {example.english}
            </Bubble>
            <p className="pl-10 text-xs text-ink-faint">{example.french}</p>
          </div>
        ))}
        <AnimatePresence>{!done && <TypingDots />}</AnimatePresence>
      </ChatFrame>
    </LearningScreen>
  );
}

/* ---------- 3 · Le piège, posé par Alex ---------- */

export function StepChatTrap({ lesson, onNext }: StepProps) {
  const [picked, setPicked] = useState<number | null>(null);
  const options = [lesson.commonMistake.wrong, lesson.commonMistake.right];
  const correct = picked === 1;

  return (
    <LearningScreen
      label={<Chip tone="coral">💬 Alex te teste</Chip>}
      title=""
      action={
        <Button size="lg" fullWidth disabled={picked === null} onClick={onNext}>
          Continuer la discussion
        </Button>
      }
    >
      <ChatFrame>
        <Bubble from="alex">
          Petit test 😏 Un francophone m&apos;a écrit ça hier. Laquelle des
          deux est correcte ?
        </Bubble>
        {picked === null ? (
          <ReplyChips options={options} onPick={setPicked} />
        ) : (
          <>
            <Bubble from="me">{options[picked]}</Bubble>
            <Bubble from="alex">
              {correct ? "Exactly! 🎯" : `Nope — c'est « ${lesson.commonMistake.right} »`}
            </Bubble>
            <Bubble from="note">{lesson.commonMistake.note}</Bubble>
          </>
        )}
      </ChatFrame>
    </LearningScreen>
  );
}

/* ---------- 4 · Quiz en mode conversation ---------- */

export function StepChatQuiz({ lesson, onNext }: StepProps) {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const question = lesson.quiz[index];
  const isLast = index === lesson.quiz.length - 1;
  const correct = picked === question.correctIndex;

  const advance = () => {
    if (isLast) {
      onNext();
    } else {
      setIndex((i) => i + 1);
      setPicked(null);
    }
  };

  return (
    <LearningScreen
      label={
        <Chip tone="primary">
          💬 Questions d&apos;Alex · {index + 1}/{lesson.quiz.length}
        </Chip>
      }
      title=""
      action={
        <Button size="lg" fullWidth disabled={picked === null} onClick={advance}>
          {isLast ? "Dernière question de la conv" : "Message suivant"}
        </Button>
      }
    >
      <ChatFrame>
        <Bubble from="alex">{question.question}</Bubble>
        {picked === null ? (
          <ReplyChips options={question.options} onPick={setPicked} />
        ) : (
          <>
            <Bubble from="me">
              <span className="inline-flex items-center gap-1.5">
                {question.options[picked]}
                {correct && <Check className="size-4" strokeWidth={3} />}
              </span>
            </Bubble>
            <Bubble from="alex">
              {correct
                ? "Yes ! 🙌"
                : `Presque — la bonne réponse : « ${question.options[question.correctIndex]} »`}
            </Bubble>
            <Bubble from="note">{question.explanation}</Bubble>
          </>
        )}
      </ChatFrame>
    </LearningScreen>
  );
}

/* ---------- 5 · Final : réponds comme un natif ---------- */

export function StepChatFinal({ lesson, onNext }: StepProps) {
  const [picked, setPicked] = useState<number | null>(null);
  const correct = picked === lesson.use.correctIndex;

  return (
    <LearningScreen
      label={<Chip tone="mint">💬 À toi de répondre</Chip>}
      title=""
      action={
        <Button size="lg" fullWidth disabled={picked === null} onClick={onNext}>
          Mark as learned
        </Button>
      }
    >
      <ChatFrame>
        <Bubble from="note">{lesson.use.situation}</Bubble>
        <Bubble from="alex">So… what do you say? 😄</Bubble>
        {picked === null ? (
          <ReplyChips options={lesson.use.options} onPick={setPicked} />
        ) : (
          <>
            <Bubble from="me">{lesson.use.options[picked]}</Bubble>
            <Bubble from="alex">
              {correct
                ? "Perfect. Tu parles comme un natif là 👏"
                : `Un natif dirait plutôt : « ${lesson.use.options[lesson.use.correctIndex]} »`}
            </Bubble>
            <Bubble from="note">
              Le bloc « {lesson.structure} » sort tout seul — c&apos;est le
              réflexe qu&apos;on construit.
            </Bubble>
          </>
        )}
      </ChatFrame>
    </LearningScreen>
  );
}
