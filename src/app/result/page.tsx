"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const titleSrc = "/images/result/Page%206%20-%20Score%20title-01.svg";
const menuSrc = "/images/result/Page%206%20-%20Score%20menu-01.svg";
const playAgainSrc = "/images/result/Page%206%207%20-%20play%20again-01.svg";
const leaderboardSrc = "/images/home/Home_Leadersboard-01.svg";

export default function ResultPage() {
  const [score, setScore] = useState(0);
  const [healthy, setHealthy] = useState(0);
  const [junk, setJunk] = useState(0);

  useEffect(() => {
    setScore(Number(sessionStorage.getItem("rider-score") ?? 0));
    setHealthy(Number(sessionStorage.getItem("rider-healthy") ?? 0));
    setJunk(Number(sessionStorage.getItem("rider-junk") ?? 0));
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
