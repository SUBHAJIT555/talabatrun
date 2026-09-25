"use server";

import { createClient } from "@/lib/supabase/server";
import type { BoardEntry, ScoreSubmission } from "@/lib/leaderboard";

function configured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export async function submitScoreAction(input: ScoreSubmission): Promise<boolean> {
  if (!configured()) return false;
  const name = input.name.trim();
  if (!name || name.length > 24 || !Number.isFinite(input.score)) return false;
  try {
    const supabase = await createClient();
    const { error } = await supabase.rpc("submit_score", {
      player_name: name,
      player_score: input.score,
      player_healthy: input.healthy,
      player_junk: input.junk,
      run_id: input.runId,
    });
    return !error;
  } catch {
    return false;
  }
}

export async function fetchLeaderboardAction(): Promise<BoardEntry[] | null> {
  if (!configured()) return null;
  try {
    const supabase = await createClient();
    const withJunk = await supabase.from("leaderboard").select("name, score, healthy, junk");
    const result = withJunk.error
      ? await supabase.from("leaderboard").select("name, score, healthy")
      : withJunk;
    const { data, error } = result;
    if (error || !data) return null;
    return data.flatMap((row) => {
      const name = typeof row.name === "string" ? row.name.trim() : "";
      const score = Number(row.score);
      const healthy = Number(row.healthy);
      const junk = Number(row.junk);
      if (!name || !Number.isFinite(score)) return [];
      return [{
        name,
        score,
        healthy: Number.isFinite(healthy) ? healthy : 0,
        junk: Number.isFinite(junk) ? junk : 0,
      }];
    });
  } catch {
    return null;
  }
}
