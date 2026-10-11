"use client";

import React, { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Non-intrusive ambient radial spotlight that smoothly traces the pointer
 * across the background without replacing or lagging the native OS cursor.
 * Automatically disabled on touch screens and under reduced motion preferences.
 */
export function PointerSpotlight() {
  const shouldReduceMotion = useReducedMotion();
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Detect touch / coarse pointer
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    if (isCoarse) {
      setIsTouch(true);
      return;
    }

    const handlePointerMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  if (shouldReduceMotion || isTouch || !pos) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
      style={{
        background: `radial-gradient(600px circle at ${pos.x}px ${pos.y}px, rgba(99, 102, 241, 0.07), rgba(56, 189, 248, 0.03) 40%, transparent 70%)`,
      }}
    />
  );
}
