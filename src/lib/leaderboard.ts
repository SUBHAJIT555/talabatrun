import { fetchLeaderboardAction, submitScoreAction } from "@/lib/leaderboard-server";

const STORAGE_KEY = "rider-board";

export type BoardEntry = {
  name: string;
  score: number;
  healthy: number;
  junk: number;
};

export type RankedEntry = BoardEntry & {
  rank: number;
};

export type ScoreSubmission = {
  name: string;
  score: number;
  healthy: number;
  junk: number;
  runId: string;
};

export function firstInitial(name: string) {
  const first = name.trim().split(/\s+/)[0] ?? "";
  return first.charAt(0).toUpperCase() || "?";
}

export function readBoard(): BoardEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((item) => {
      if (!item || typeof item !== "object") return [];
      const name = "name" in item && typeof item.name === "string" ? item.name.trim() : "";
      const score = "score" in item && typeof item.score === "number" ? item.score : NaN;
      const healthy = "healthy" in item && typeof item.healthy === "number" ? item.healthy : 0;
      const junk = "junk" in item && typeof item.junk === "number" ? item.junk : 0;
      if (!name || !Number.isFinite(score)) return [];
      return [{
        name,
        score,
        healthy: Number.isFinite(healthy) ? healthy : 0,
        junk: Number.isFinite(junk) ? junk : 0,
      }];
    });
  } catch {
    return [];
  }
}

/**
 * Keeps a rider's best score.
 * When two runs share that score, the one with more good food is kept.
 */
export function recordScore(name: string, score: number, healthy = 0, junk = 0) {
  const trimmed = name.trim();
  const good = Number.isFinite(healthy) ? healthy : 0;
  const bad = Number.isFinite(junk) ? junk : 0;
  if (!trimmed || !Number.isFinite(score)) return;
  const board = readBoard();
  const existing = board.find((entry) => entry.name.toLowerCase() === trimmed.toLowerCase());
  if (!existing) {
    board.push({ name: trimmed, score, healthy: good, junk: bad });
  } else if (score > existing.score || (score === existing.score && good > existing.healthy)) {
    existing.score = score;
    existing.healthy = good;
    existing.junk = bad;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(board));
}

export function rankBoard(entries: BoardEntry[]): RankedEntry[] {
  return [...entries]
    .sort((a, b) => b.score - a.score || b.healthy - a.healthy || a.name.localeCompare(b.name))
    .map((entry, index) => ({ ...entry, rank: index + 1 }));
}

/** Saves the run locally, then sends it to Supabase. A repeat of the same run is ignored. */
export async function submitScore(input: ScoreSubmission) {
  recordScore(input.name, input.score, input.healthy, input.junk);
  sessionStorage.setItem("rider-run", input.runId);
  sessionStorage.setItem("rider-pending", "1");
  const ok = await submitScoreAction(input);
  if (ok) sessionStorage.removeItem("rider-pending");
  return ok;
}

/** Shared board when Supabase is configured. This browser's board until then, or if the request fails. */
export async function loadLeaderboard(): Promise<BoardEntry[]> {
  const remote = await fetchLeaderboardAction();
  return remote ?? readBoard();
}
