import { Variants, Transition } from "framer-motion";

export const MOTION_TIMINGS = {
  instant: 0.15,
  fast: 0.25,
  normal: 0.4,
  slow: 0.65,
  deliberate: 1.0,
};

export const MOTION_EASINGS = {
  // Smooth cubic bezier easing
  smoothOut: [0.16, 1, 0.3, 1] as const,
  gentleOut: [0.25, 0.9, 0.4, 1] as const,
  anticipate: [0.38, 0.005, 0.215, 1] as const,
};

export const SPRING_CONFIGS = {
  snappy: { type: "spring", stiffness: 450, damping: 30 } as Transition,
  gentle: { type: "spring", stiffness: 220, damping: 25 } as Transition,
  bouncy: { type: "spring", stiffness: 350, damping: 18 } as Transition,
  mascot: { type: "spring", stiffness: 180, damping: 22 } as Transition,
};

export const fadeInVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: MOTION_TIMINGS.normal, ease: MOTION_EASINGS.smoothOut },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: MOTION_TIMINGS.fast, ease: MOTION_EASINGS.smoothOut },
  },
};

export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

export const scaleCardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 14 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: MOTION_TIMINGS.normal, ease: MOTION_EASINGS.smoothOut },
  },
  hover: {
    y: -3,
    transition: { duration: 0.2, ease: MOTION_EASINGS.smoothOut },
  },
};

export const routeTransitionVariants: Variants = {
  initial: {
    opacity: 0,
    y: 10,
    scale: 0.995,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: MOTION_EASINGS.smoothOut,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.995,
    transition: {
      duration: 0.2,
      ease: MOTION_EASINGS.smoothOut,
    },
  },
};

export const heroEntranceVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: custom * 0.12,
      duration: 0.5,
      ease: MOTION_EASINGS.smoothOut,
    },
  }),
};
