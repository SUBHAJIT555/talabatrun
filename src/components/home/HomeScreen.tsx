"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

const logoSrc = "/images/home/Home%20_game%20logo-01.svg";
const startSrc = "/images/home/Home_Start-01.svg";
const leaderboardSrc = "/images/home/Home_Leadersboard-01.svg";

/**
 * Edit each food on its own.
 * Positions and size are percentages of the 9:16 screen.
 * Use `top` or `bottom`, not both.
 */
const foods = [
  {
    name: "pizza",
    src: "/images/home/food-pizza.webp",
    size: 12,
    top: 10,
    right: 70,
    z: 10,
    rotate: 12,
    float: 10,
    tilt: 5,
    duration: 3.6,
  },
  {
    name: "burger",
    src: "/images/home/food-burger.webp",
    size: 20,
    top: 10,
    right: 7,
    z: 20,
    rotate: 30,
    float: 12,
    tilt: 4,
    duration: 3.1,
  },
  {
    name: "fries",
    src: "/images/home/food-fries.webp",
    size: 15,
    top: 50,
    right: 1,
    z: 20,
    rotate: -20,
    float: 14,
    tilt: 6,
    duration: 2.8,
  },
  {
    name: "donut",
    src: "/images/home/food-donut.webp",
    size: 35,
    bottom: 0,
    right: -7,
    z: 30,
    rotate: -8,
    float: 8,
    tilt: 5,
    duration: 3.4,
  },
];

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
          src="/images/home/homepageBG.webp"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[34%] bg-linear-to-b from-white/75 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[28%] bg-linear-to-t from-black/35 to-transparent" />

        <img
          src={logoSrc}
          alt="Rider Rush"
          className="absolute top-[4%] left-1/2 z-20 w-[64%] -translate-x-1/2"
        />

        {foods.map((item) => (
          <motion.img
            key={item.name}
            src={item.src}
            alt=""
            className="pointer-events-none absolute drop-shadow-[0_12px_10px_rgba(20,8,4,0.35)]"
            style={{
              width: `${item.size}%`,
              top: item.top !== undefined ? `${item.top}%` : undefined,
              bottom: item.bottom !== undefined ? `${item.bottom}%` : undefined,
              right: `${item.right}%`,
              zIndex: item.z,
            }}
            animate={
              reduce
                ? { rotate: item.rotate }
                : {
                    y: [0, -item.float, 0],
                    rotate: [item.rotate, item.rotate + item.tilt, item.rotate],
                  }
            }
            transition={{ duration: item.duration, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}

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
