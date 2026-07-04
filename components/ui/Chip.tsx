import { cn } from "@/lib/utils";

type Tone = "primary" | "mint" | "coral" | "neutral" | "gold";

const tones: Record<Tone, string> = {
  primary: "bg-primary-50 text-primary-700",
  mint: "bg-mint-50 text-mint-600",
  coral: "bg-coral-50 text-coral-600",
  neutral: "bg-ink/5 text-ink-soft",
  gold: "bg-gold-50 text-gold-500",
};

export function Chip({
  tone = "neutral",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold tracking-tight",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
