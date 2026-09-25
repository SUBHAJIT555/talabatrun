"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Geist } from "next/font/google";
import { motion, useReducedMotion } from "motion/react";
import {
  firstInitial,
  rankBoard,
  loadLeaderboard,
  submitScore,
  type RankedEntry,
} from "@/lib/leaderboard";

const geist = Geist({ subsets: ["latin"] });

const logoSrc = "/images/leaderboard/Leadersbard%20logo-01.svg";
const playSrc = "/images/home/Home_Start-01.svg";

const ink = "#490B0E";

const foods = [
  {
    name: "pizza",
    src: "/images/home/food-pizza.webp",
    size: 22,
    top: 3,
    left: -2,
    rotate: -18,
    float: 10,
    tilt: 5,
    duration: 3.6,
  },
  {
    name: "burger",
    src: "/images/home/food-burger.webp",
    size: 20,
    top: 11,
    right: -2,
    rotate: 24,
    float: 12,
    tilt: 4,
    duration: 3.2,
  },
  {
    name: "fries",
    src: "/images/home/food-fries.webp",
    size: 15,
    top: 54,
    left: -1,
    rotate: 16,
    float: 12,
    tilt: 6,
    duration: 2.9,
  },
  {
    name: "donut",
    src: "/images/home/food-donut.webp",
    size: 45,
    bottom: -3,
    right: -12,
    rotate: -12,
    float: 8,
    tilt: 5,
    duration: 3.4,
  },
];

const cards = {
  1: {
    bg: "/images/leaderboard/cards/Card%201_bg-01.svg",
    icon: "/images/leaderboard/cards/Card%201_bg%20icon-01.svg",
    drop: "0%",
    shift: "0%",
    letterTop: "39%",
    letterSize: "54%",
    nameTop: "74%",
    scoreTop: "81.5%",
    text: "text-white",
    avatar: "#FFD56A",
  },
  2: {
    bg: "/images/leaderboard/cards/Card%202_bg-01.svg",
    icon: "/images/leaderboard/cards/Card%202_icon-01.svg",
    drop: "7.2%",
    shift: "18%",
    letterTop: "41%",
    letterSize: "44%",
    nameTop: "70.5%",
    scoreTop: "78%",
    text: "text-[#490B0E]",
    avatar: "#E4E7EE",
  },
  3: {
    bg: "/images/leaderboard/cards/Card%203_bg-01.svg",
    icon: "/images/leaderboard/cards/Card%203_icon-01.svg",
    drop: "7.2%",
    shift: "-18%",
    letterTop: "40%",
    letterSize: "44%",
    nameTop: "70%",
    scoreTop: "78%",
    text: "text-[#490B0E]",
    avatar: "#F0B48C",
  },
} as const;

function sameRider(a: string, b: string) {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

function PodiumCard({ entry }: { entry: RankedEntry }) {
  const place = entry.rank as 1 | 2 | 3;
  const card = cards[place];

  return (
    <div
      className="relative w-full"
      style={{
        transform: `translate(${card.shift}, ${card.drop})`,
        filter:
          "drop-shadow(0 10px 12px rgba(20, 6, 2, 0.62)) drop-shadow(0 0 18px rgba(255, 210, 120, 0.7))",
      }}
    >
      <img src={card.bg} alt="" className="w-full" />
      <div
        className="absolute left-1/2 flex aspect-square -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[0.4cqh] border-white font-black"
        style={{
          top: card.letterTop,
          width: card.letterSize,
          color: ink,
          fontSize: "2.6cqh",
          backgroundColor: card.avatar,
        }}
        aria-hidden="true"
      >
        {firstInitial(entry.name)}
      </div>
      <img src={card.icon} alt="" className="pointer-events-none absolute inset-0 h-full w-full" />
      <p
        className={`absolute left-1/2 z-10 max-w-[86%] -translate-x-1/2 truncate text-center text-[1.45cqh] leading-none font-bold ${card.text}`}
        style={{ top: card.nameTop }}
      >
        {entry.name.split(/\s+/)[0]}
      </p>
      <p
        className={`absolute left-1/2 z-10 -translate-x-1/2 text-[2.15cqh] leading-none font-black ${card.text}`}
        style={{ top: card.scoreTop }}
      >
        {entry.score}
      </p>
    </div>
  );
}

export function LeaderboardScreen() {
  const [board, setBoard] = useState<RankedEntry[]>([]);
  const [ready, setReady] = useState(false);
  const [you, setYou] = useState("");
  const reduce = useReducedMotion();

  useEffect(() => {
    let cancel = false;
    const name = sessionStorage.getItem("rider-name") ?? "";
    const storedScore = sessionStorage.getItem("rider-score");
    const runId = sessionStorage.getItem("rider-run");
    const pending = sessionStorage.getItem("rider-pending") === "1";
    setYou(name);

    void (async () => {
      if (pending && name && storedScore !== null && runId) {
        await submitScore({
          name,
          score: Number(storedScore),
          healthy: Number(sessionStorage.getItem("rider-healthy") ?? 0),
          junk: Number(sessionStorage.getItem("rider-junk") ?? 0),
          runId,
        });
      }
      const entries = await loadLeaderboard();
      if (cancel) return;
      setBoard(rankBoard(entries));
      setReady(true);
    })();

    return () => {
      cancel = true;
    };
  }, []);

  const podium = [2, 1, 3].map((rank) => board.find((entry) => entry.rank === rank) ?? null);
  const youEntry = board.find((entry) => you && sameRider(entry.name, you));
  const pinYou = youEntry && youEntry.rank > 10 ? youEntry : null;
  const list = board.filter((entry) => entry.rank !== pinYou?.rank);

  return (
    <main className="flex h-dvh w-full items-center justify-center overflow-hidden bg-black" style={{ color: ink }}>
      <section
        className={`relative overflow-hidden ${geist.className}`}
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
        {foods.map((item) => (
          <motion.img
            key={item.name}
            src={item.src}
            alt=""
            className="pointer-events-none absolute z-1 drop-shadow-[0_12px_10px_rgba(20,8,4,0.35)]"
            style={{
              width: `${item.size}%`,
              top: "top" in item ? `${item.top}%` : undefined,
              bottom: "bottom" in item ? `${item.bottom}%` : undefined,
              left: "left" in item ? `${item.left}%` : undefined,
              right: "right" in item ? `${item.right}%` : undefined,
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
        <div className="absolute inset-x-[6%] top-[1.4%] bottom-[2%] z-10 flex flex-col items-center">
          <img src={logoSrc} alt="Rider Rush Leaderboard" className="w-[50%] shrink-0" />

          <div className="mt-[0.6cqh] grid w-full shrink-0 grid-cols-3 items-end gap-0 pb-[1.6cqh]">
            {podium.map((entry, index) =>
              entry ? <PodiumCard key={entry.rank} entry={entry} /> : <div key={`empty-${index}`} />,
            )}
          </div>

          <div className=" flex min-h-0 w-[84%] flex-1 flex-col overflow-hidden rounded-[1.6cqh] bg-white px-[8%] py-[1.2cqh] shadow-[0_8px_18px_rgba(73,11,14,0.08)]">
     
            <div className="grid shrink-0 grid-cols-[16%_1fr_20%] px-[2%] pb-[0.7cqh] text-[1.4cqh] font-black">
              <span>#</span>
              <span>Name</span>
              <span className="text-right">Score</span>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {!ready ? null : board.length === 0 ? (
                <p className="py-[2cqh] text-center text-[1.6cqh] font-bold">No scores yet</p>
              ) : (
                <ul className="flex flex-col gap-[0.25cqh]">
                  {list.map((entry) => (
                    <Row key={entry.rank} entry={entry} you={you} />
                  ))}
                </ul>
              )}
            </div>
            {pinYou ? <Row entry={pinYou} you={you} /> : null}
          </div>

          <Link href="/register" className="mt-[1.4cqh] block w-[92%] shrink-0">
            <img src={playSrc} alt="Start" className="w-full" />
          </Link>
        </div>
      </section>
    </main>
  );
}

function Row({ entry, you }: { entry: RankedEntry; you: string }) {
  const isYou = Boolean(you) && sameRider(entry.name, you);
  return (
    <li
      className={`grid grid-cols-[16%_1fr_20%] items-center rounded-lg px-[2%] py-[0.7cqh] text-[1.65cqh] font-bold ring-1 ring-inset ring-gray-200 ${
        isYou ? "bg-[#C6F54A] font-black" : ""
      }`}
    >
      <span>{isYou ? `#${entry.rank}` : entry.rank}</span>
      <span className="truncate">{isYou ? "You" : entry.name}</span>
      <span className="text-right">{entry.score}</span>
    </li>
  );
}
