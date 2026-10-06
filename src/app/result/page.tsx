"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const titleSrc = "/images/result/Page%206%20-%20Score%20title-01.svg";
const menuSrc = "/images/result/Page%206%20-%20Score%20menu-01.svg";
const playAgainSrc = "/images/result/Page%206%207%20-%20play%20again-01.svg";
const leaderboardSrc = "/images/home/Home_Leadersboard-01.svg";

const confettiColors = ["#FF5900", "#FFD56A", "#C6F54A", "#FFFFFF", "#FF8A3D", "#5EC8FF", "#FF5FA2", "#B8FE00"];

export default function ResultPage() {
  const [score, setScore] = useState(0);
  const [healthy, setHealthy] = useState(0);
  const [junk, setJunk] = useState(0);
  const cheered = useRef(false);

  useEffect(() => {
    setScore(Number(sessionStorage.getItem("rider-score") ?? 0));
    setHealthy(Number(sessionStorage.getItem("rider-healthy") ?? 0));
    setJunk(Number(sessionStorage.getItem("rider-junk") ?? 0));
    if (cheered.current) return;
    cheered.current = true;
    const cheer = new Audio("/sounds/game/cheer.ogg");
    cheer.volume = 0.85;
    void cheer.play().catch(() => {});
  }, []);

  return (
    <main className="flex h-dvh w-full items-center justify-center overflow-hidden bg-black text-[#490B0E]">
      <section
        className="relative overflow-hidden"
        style={{
          containerType: "size",
          width: "min(100vw, calc(100dvh * 9 / 16))",
          height: "min(100dvh, calc(100vw * 16 / 9))",
        }}
      >
        <img
          src="/images/result/resultBG.webp"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <Confetti />

        <div className="absolute inset-x-0 top-[3%] flex flex-col items-center">
          <div className="relative w-[74%]">
            <img src={titleSrc} alt="Amazing! You scored" className="w-full" />
            <p className="absolute top-[64%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-[12.5cqh] leading-none font-black tracking-tight">
              {score}
            </p>
          </div>

          <div className="relative -mt-[1cqh] w-[88%]">
            <img src={menuSrc} alt="" className="w-full" />
            <div className="absolute inset-x-[6%] top-[40%] grid grid-cols-3 text-center text-[4.2cqh] leading-none font-semibold">
              <span>{healthy}</span>
              <span>{junk}</span>
            </div>
          </div>

          <div className="mt-[1.6cqh] flex w-[78%] flex-col items-center gap-[1cqh]">
            <Link href="/" className="block w-full">
              <img src={playAgainSrc} alt="Play Again" className="w-full" />
            </Link>
            <Link href="/leaderboard" className="block w-[92%]">
              <img src={leaderboardSrc} alt="Leaderboard" className="w-full" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function Confetti() {
  const pieces = Array.from({ length: 54 }, (_, index) => {
    const color = confettiColors[index % confettiColors.length];
    const left = ((index * 37) % 100) + ((index % 5) - 2) * 0.8;
    const size = 7 + (index % 6);
    return {
      index,
      color,
      left,
      size,
      delay: (index % 12) * 0.08,
      duration: 2.6 + (index % 7) * 0.28,
      drift: `${((index * 17) % 70) - 35}px`,
      spin: `${220 + (index % 8) * 80}deg`,
      round: index % 4 === 0,
    };
  });

  return (
    <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden" aria-hidden="true">
      {pieces.map((piece) => (
        <span
          key={piece.index}
          className="absolute top-0 block animate-[confetti-fall_linear_forwards]"
          style={{
            left: `${piece.left}%`,
            width: piece.size,
            height: piece.round ? piece.size : Math.max(4, piece.size * 0.42),
            background: piece.color,
            borderRadius: piece.round ? "999px" : "2px",
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            ["--drift" as string]: piece.drift,
            ["--spin" as string]: piece.spin,
          }}
        />
      ))}
    </div>
  );
}
