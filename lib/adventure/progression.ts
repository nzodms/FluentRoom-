import type { Reward, UserProgress } from "@/types/learning";
import { getChapterById } from "@/lib/lessons/chapters";
import { applyReward, rollReward } from "@/lib/chests";
import type {
  AdventureNodeDef,
  AdventureNodeState,
  AdventureNodeView,
  AdventureProgress,
  AdventureZone,
} from "./types";

/**
 * Progression Aventure : les états des nodes sont DÉRIVÉS de la
 * progression réelle (progress.chapters, coffres ouverts) — jamais
 * stockés en dur. Terminer un chapitre met la map à jour toute seule.
 */

const DIFFICULTY_FR: Record<number, string> = {
  1: "Facile",
  2: "Intermédiaire",
  3: "Avancé",
};

function chapterDone(progress: UserProgress, node: AdventureNodeDef): boolean {
  return Boolean(node.chapter && progress.chapters?.[node.chapter.chapterId]);
}

function nodeMeta(node: AdventureNodeDef): AdventureNodeView["meta"] {
  const chapter = node.chapter ? getChapterById(node.chapter.chapterId) : undefined;
  if (chapter) {
    return {
      durationMin: chapter.duration,
      difficultyFr: DIFFICULTY_FR[chapter.difficulty] ?? null,
      rewardFP: chapter.rewardFP,
    };
  }
  return {
    durationMin: node.durationMin ?? null,
    difficultyFr: null,
    rewardFP: node.reward?.fp ?? null,
  };
}

/** Calcule l'état de chaque node de la zone à partir de la progression. */
export function zoneProgress(
  zone: AdventureZone,
  progress: UserProgress,
): AdventureProgress {
  const byId = new Map(zone.nodes.map((n) => [n.id, n]));
  const pathNodes = zone.path
    .map((id) => byId.get(id))
    .filter((n): n is AdventureNodeDef => Boolean(n));

  const doneCount = pathNodes.filter((n) => chapterDone(progress, n)).length;
  const firstOpenIndex = pathNodes.findIndex((n) => !chapterDone(progress, n));
  const currentIndex = firstOpenIndex === -1 ? pathNodes.length - 1 : firstOpenIndex;
  const openedChests = progress.adventureChests ?? [];

  const stepOf = new Map(zone.path.map((id, i) => [id, i + 1]));

  const nodes: AdventureNodeView[] = zone.nodes.map((node) => {
    let state: AdventureNodeState;
    let lockedReason: string | null = null;

    if (node.type === "chapter") {
      const index = zone.path.indexOf(node.id);
      if (chapterDone(progress, node)) {
        state = "done";
      } else if (index === currentIndex) {
        state = "current";
      } else {
        state = "locked";
        const prev = pathNodes[index - 1];
        lockedReason = prev
          ? `Termine « ${prev.title} » pour débloquer ce chapitre.`
          : "Continue le chemin pour débloquer ce chapitre.";
      }
    } else if (node.type === "chest") {
      if (openedChests.includes(node.id)) {
        state = "done";
      } else if (doneCount >= (node.requiresChaptersDone ?? 1)) {
        state = "reward";
      } else {
        state = "locked";
        const missing = (node.requiresChaptersDone ?? 1) - doneCount;
        lockedReason = `Termine encore ${missing} chapitre${missing > 1 ? "s" : ""} pour ouvrir ce coffre.`;
      }
    } else {
      // Défi express : toujours accessible, courte session plaisir.
      state = "available";
    }

    return {
      ...node,
      state,
      step: stepOf.get(node.id) ?? null,
      meta: nodeMeta(node),
      lockedReason,
    };
  });

  return {
    zone,
    nodes,
    currentNodeId: pathNodes[currentIndex]?.id ?? null,
    doneCount,
    totalCount: pathNodes.length,
    currentStep: currentIndex + 1,
  };
}

/* ---------- Coffre bonus de la map ---------- */

export interface AdventureChestOutcome {
  progress: UserProgress;
  reward: Reward | null;
}

/** Ouvre le coffre bonus d'un node (une seule fois par node). */
export function openAdventureChest(
  progress: UserProgress,
  nodeId: string,
): AdventureChestOutcome {
  const opened = progress.adventureChests ?? [];
  if (opened.includes(nodeId)) return { progress, reward: null };

  const reward = rollReward(progress);
  const next = applyReward(
    { ...progress, adventureChests: [...opened, nodeId] },
    reward,
  );
  return { progress: next, reward };
}
