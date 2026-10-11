"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { routeTransitionVariants } from "@/lib/motion/motion-tokens";

interface RouteTransitionProps {
  children: React.ReactNode;
}

export function RouteTransition({ children }: RouteTransitionProps) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      key={pathname}
      variants={routeTransitionVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="w-full flex-1"
      style={{
        transformPerspective: 1000,
        backfaceVisibility: "hidden",
      }}
    >
      {children}
    </motion.div>
  );
}
