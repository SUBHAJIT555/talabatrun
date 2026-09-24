"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ResultPage() {
  const [score, setScore] = useState("0");

  useEffect(() => {
    setScore(sessionStorage.getItem("rider-score") ?? "0");
  }, []);

  return (
    <main className="flex h-dvh w-full items-center justify-center overflow-hidden bg-black text-[#490B0E]">
      <section
        className="relative flex flex-col items-center justify-center overflow-hidden bg-[#F7ECE2]"
        style={{
          width: "min(100vw, calc(100dvh * 9 / 16))",
          height: "min(100dvh, calc(100vw * 16 / 9))",
        }}
      >
        <img src="/images/gameimages/Game%20page_%20score-01.svg" alt="Score" className="w-[42%]" />
        <p className="mt-[2cqh] text-[8cqh] leading-none font-black">{score}</p>
        <Link href="/" className="mt-[6cqh] text-[3cqh] font-black text-[#FF5900]">
          Play again
        </Link>
      </section>
    </main>
  );
}
