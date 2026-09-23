"use client";

import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "motion/react";
import { scaleIn, springPop } from "@/lib/motion";

const GameCanvas = dynamic(() => import("@/components/game/GameCanvas"), {
  ssr: false,
});

const logoSrc = "/images/home/talabatsvg.svg";

export default function GamePage() {
  const reduce = useReducedMotion();

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
        <div className="absolute top-[38%] left-1/2 w-[58%] -translate-x-1/2">
          <motion.img
            src={logoSrc}
            alt="talabat"
            className="w-full"
            variants={scaleIn}
            initial="initial"
            animate="animate"
            transition={reduce ? { duration: 0.01 } : springPop}
          />
        </div>
        <GameCanvas />
      </section>
    </main>
  );
}
