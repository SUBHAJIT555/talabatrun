"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createGame } from "@/game/createGame";

export default function GameCanvas() {
  const host = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const parent = host.current;
    if (!parent) return;
    const game = createGame(parent, (score) => {
      sessionStorage.setItem("rider-score", String(score));
      router.push("/result");
    });
    return () => {
      game?.destroy(true);
    };
  }, [router]);

  return (
    <div className="absolute inset-0">
      <video
        src="/images/game/gamescene.webm"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="pointer-events-none absolute top-1/2 left-1/2 h-[112%] w-[112%] max-w-none -translate-x-1/2 -translate-y-1/2 object-cover"
      />
      <div ref={host} id="game-container" className="absolute inset-0" />
    </div>
  );
}
