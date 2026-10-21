"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

const logoSrc = "/images/talabatlogo.svg";
const startSrc = "/images/home/Home_Start-01.svg";
const leaderboardSrc = "/images/home/Home_Leadersboard-01.svg";

export function HomeScreen() {
  const reduce = useReducedMotion();

  return (
    <main className="flex h-dvh w-full items-center justify-center overflow-hidden bg-black">
      <section
        className="relative overflow-hidden"
        style={{
          containerType: "size",
          width: "min(100vw, calc(100dvh * 9 / 16))",
          height: "min(100dvh, calc(100vw * 16 / 9))",
        }}
      >
        <img
          src="/images/home/homepageBG-noburj.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[34%] bg-linear-to-b from-white/75 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[28%] bg-linear-to-t from-black/35 to-transparent" />
        <img
          src={logoSrc}
          alt="talabat"
          className="absolute top-[5%] left-1/2 z-20 w-[52%] -translate-x-1/2"
        />

        <div className="absolute inset-x-[9%] bottom-[6%] z-30 flex flex-col items-center gap-[1.2cqh]">
          <motion.div
            className="w-full"
            animate={reduce ? undefined : { scale: [1, 1.03, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <Link href="/register" className="block">
              <img src={startSrc} alt="Start" className="w-full" />
            </Link>
          </motion.div>
          <Link href="/leaderboard" className="block w-[90%]">
            <img src={leaderboardSrc} alt="Leaderboard" className="w-full" />
          </Link>
        </div>
      </section>
    </main>
  );
}
