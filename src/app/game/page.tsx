"use client";

import dynamic from "next/dynamic";

const GameCanvas = dynamic(() => import("@/components/game/GameCanvas"), {
  ssr: false,
});

export default function GamePage() {
  return (
    <main className="flex h-dvh w-full items-center justify-center overflow-hidden bg-black">
      <section
        className="relative overflow-hidden bg-black"
        style={{
          containerType: "size",
          width: "min(100vw, calc(100dvh * 9 / 16))",
          height: "min(100dvh, calc(100vw * 16 / 9))",
        }}
      >
        <GameCanvas />
      </section>
    </main>
  );
}
