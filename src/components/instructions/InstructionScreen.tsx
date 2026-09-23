"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

const backgroundSrc = "/images/registration/registrationpageBG.webp";
const headingSrc = "/images/registration/Page%203%20_%20How%20to%20play-01.svg";

const rules = [
  {
    src: "/images/instruction/Page%203%20_%20Rule%201.svg",
    alt: "Collecting good food, plus 10 points",
  },
  {
    src: "/images/instruction/Page%203%20_%20Rule%202.svg",
    alt: "Collecting junk food, minus 5 points",
  },
  {
    src: "/images/instruction/Page%203%20_%20Rule%203.svg",
    alt: "You have 60 seconds to get the highest score",
  },
];

const joystickSrc = "/images/instruction/Page%203%20_%20Rule%204.svg";
const playSrc = "/images/registration/Page%203%20_%20Play-01.svg";

export function InstructionScreen() {
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
        <img src={backgroundSrc} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[42%] bg-linear-to-b from-white/45 to-transparent" />

        <div className="absolute inset-x-[8%] top-[5%] z-10 flex flex-col items-center">
          <h1 className="w-[90%]">
            <img src={headingSrc} alt="How to Play" className="w-full" />
          </h1>

          <div className="mt-[1.8cqh] flex w-[94%] flex-col gap-[0.7cqh]">
            {rules.map((rule) => (
              <img key={rule.alt} src={rule.src} alt={rule.alt} className="w-full" />
            ))}
          </div>

          <img
            src={joystickSrc}
            alt="Use the joystick to move left and right"
            className="mt-[1.1cqh] w-[86%]"
          />

          <motion.div
            className="mt-[5.4cqh] w-[62%]"
            animate={reduce ? undefined : { scale: [1, 1.03, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <Link href="/countdown" aria-label="Play" className="block">
              <img src={playSrc} alt="Play" className="w-full" />
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
