import type { Transition, Variants } from "motion/react";

export const easeOutExpo: Transition["ease"] = [0.22, 1, 0.36, 1];

export const pageTransition: Transition = {
  duration: 0.45,
  ease: easeOutExpo,
};

export const pageVariants: Variants = {
  initial: { opacity: 0, y: 28, scale: 0.985 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -18, scale: 0.99 },
};

export const fadeUp: Variants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.86 },
  animate: { opacity: 1, scale: 1 },
};

export const stagger: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.06,
    },
  },
};

export const springPop = {
  type: "spring" as const,
  stiffness: 420,
  damping: 22,
  mass: 0.8,
};
