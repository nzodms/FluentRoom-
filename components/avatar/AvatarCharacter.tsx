"use client";

import type { AvatarConfig } from "@/types/learning";
import {
  FluentCharacter,
  type CharacterExpression,
} from "./FluentCharacter";

/**
 * Alias de compatibilité : l'ancien AvatarCharacter délègue au
 * nouveau FluentCharacter (personnage 2D en calques, expressif).
 */
export function AvatarCharacter({
  config,
  size = 96,
  expression = "neutral",
  className,
}: {
  config: AvatarConfig;
  size?: number;
  expression?: CharacterExpression;
  className?: string;
}) {
  return (
    <FluentCharacter
      config={config}
      size={size}
      expression={expression}
      className={className}
    />
  );
}
