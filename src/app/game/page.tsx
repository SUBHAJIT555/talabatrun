"use client";

import dynamic from "next/dynamic";

const GameCanvas = dynamic(() => import("@/components/game/GameCanvas"), {
  ssr: false,
});

export default function GamePage() {
  return (
    <main className="h-full w-full">
      Game
      <GameCanvas />
    </main>
  );
}
