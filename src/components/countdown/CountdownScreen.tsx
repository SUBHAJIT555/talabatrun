"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCurtainSettled } from "@/components/motion/PageCurtains";

const backgroundSrc = "/images/countdown/gamecoundownBG.webp";

const steps = [
  { src: "/images/countdown/Page%204%20_%203.svg", alt: "3", width: "46%" },
  { src: "/images/countdown/Page%204%20_%202.svg", alt: "2", width: "46%" },
  { src: "/images/countdown/Page%204%20_%201.svg", alt: "1", width: "46%" },
  { src: "/images/countdown/Page%204%20_%20Go-01.svg", alt: "Go", width: "72%" },
];

const stepMs = 1000;

export function CountdownScreen() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const settled = useCurtainSettled();
  const [step, setStep] = useState(0);
  const current = steps[step];

  useEffect(() => {
    if (!settled) return;

    if (step < steps.length - 1) {
      const id = window.setTimeout(() => setStep((value) => value + 1), stepMs);
      return () => window.clearTimeout(id);
    }

    const id = window.setTimeout(() => router.push("/game"), stepMs);
    return () => window.clearTimeout(id);
  }, [router, settled, step]);

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

        <div className="absolute inset-0 z-10 flex items-center justify-center" aria-live="assertive">
          {settled ? (
            <AnimatePresence mode="wait">
              <motion.img
                key={current.alt}
                src={current.src}
                alt={current.alt}
                style={{ width: current.width }}
                initial={reduce ? false : { opacity: 1, scale: 0.55 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.45 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
              />
            </AnimatePresence>
          ) : null}
        </div>
      </section>
    </main>
  );
}
