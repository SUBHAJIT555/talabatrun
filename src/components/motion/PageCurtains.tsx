"use client";

import { motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

const columns = 14;
const duration = 0.42;
const stagger = 0.028;
const coverMs = (duration + stagger * (columns - 1)) * 1000;

const CurtainSettledContext = createContext(true);

export function useCurtainSettled() {
  return useContext(CurtainSettledContext);
}

function skipsCurtain(from: string, to: string) {
  return (
    (from === "/countdown" && to === "/game") ||
    (from === "/game" && to === "/countdown")
  );
}

export function PageCurtains({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(children);
  const [covered, setCovered] = useState(false);
  const [settled, setSettled] = useState(true);
  const pathRef = useRef(pathname);
  const childrenRef = useRef(children);
  childrenRef.current = children;

  useEffect(() => {
    if (pathRef.current === pathname) return;

    if (reduce || skipsCurtain(pathRef.current, pathname)) {
      pathRef.current = pathname;
      setShown(childrenRef.current);
      setCovered(false);
      setSettled(true);
      return;
    }

    setSettled(false);
    setCovered(true);
    const swapId = window.setTimeout(() => {
      pathRef.current = pathname;
      setShown(childrenRef.current);
      setCovered(false);
    }, coverMs);
    const settleId = window.setTimeout(() => setSettled(true), coverMs * 2);

    return () => {
      window.clearTimeout(swapId);
      window.clearTimeout(settleId);
    };
  }, [pathname, reduce]);

  return (
    <div className="h-full">
      <CurtainSettledContext.Provider value={settled}>{shown}</CurtainSettledContext.Provider>
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center">
        <div
          className={`flex h-full ${covered ? "pointer-events-auto" : ""}`}
          style={{
            width: "min(100vw, calc(100dvh * 9 / 16))",
            height: "min(100dvh, calc(100vw * 16 / 9))",
          }}
        >
        {Array.from({ length: columns }, (_, index) => (
          <motion.div
            key={index}
            className="h-full flex-1 bg-neutral-950"
            initial={false}
            animate={{ scaleY: covered ? 1 : 0 }}
            transition={{
              duration: reduce ? 0 : duration,
              delay: reduce ? 0 : index * stagger,
              ease: [0.76, 0, 0.24, 1],
            }}
            style={{ transformOrigin: index % 2 === 0 ? "top" : "bottom" }}
          />
        ))}
        </div>
      </div>
    </div>
  );
}
