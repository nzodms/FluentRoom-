"use client";

import { cn } from "@/lib/utils";

interface LearningScreenProps {
  /** Chip d'étape, ex: <Chip tone="primary">Étape 3 · Check</Chip>. */
  label?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Zone d'action en bas — toujours visible, jamais sous le fold. */
  action?: React.ReactNode;
  /** Centre verticalement le contenu (écrans courts type Hook). */
  centered?: boolean;
  children: React.ReactNode;
  className?: string;
}

/**
 * "One screen learning" : consigne + contenu + action sur UN écran mobile.
 * Le contenu défile en interne uniquement s'il dépasse — le CTA reste
 * toujours visible, au-dessus de la safe-area iOS.
 */
export function LearningScreen({
  label,
  title,
  subtitle,
  action,
  centered = false,
  children,
  className,
}: LearningScreenProps) {
  return (
    <div className={cn("flex min-h-0 flex-1 flex-col pt-4", className)}>
      <div className="shrink-0">
        {label && <div className="mb-2.5">{label}</div>}
        <h2 className="text-[22px] font-bold leading-tight tracking-tight text-ink">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-sm leading-snug text-ink-soft">{subtitle}</p>
        )}
      </div>

      <div
        className={cn(
          "min-h-0 flex-1 overflow-y-auto py-3 no-scrollbar",
          centered && "flex flex-col justify-center",
        )}
      >
        {children}
      </div>

      {action && (
        <div className="shrink-0 space-y-2 pb-[max(env(safe-area-inset-bottom),1rem)] pt-2">
          {action}
        </div>
      )}
    </div>
  );
}
