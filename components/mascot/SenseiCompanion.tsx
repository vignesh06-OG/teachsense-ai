"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Brain,
  X,
  EyeOff,
  Bot,
  HelpCircle,
  Compass,
  Moon,
} from "lucide-react";
import { useWorkflow } from "@/lib/context/WorkflowContext";
import { SPRING_CONFIGS } from "@/lib/motion/motion-tokens";

interface Coordinates {
  x: number;
  y: number;
}

export function SenseiCompanion() {
  const {
    mascotState,
    mascotMessage,
    mascotTargetId,
    setMascotState,
    dismissMascot,
    triggerMascotThinking,
  } = useWorkflow();

  const [mousePos, setMousePos] = useState<Coordinates>({ x: 0, y: 0 });
  const [isDisabled, setIsDisabled] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isEarTwitching, setIsEarTwitching] = useState(false);
  const [targetCoords, setTargetCoords] = useState<Coordinates | null>(null);

  const mascotRef = useRef<HTMLDivElement>(null);

  const handleMascotClick = () => {
    if (!mascotMessage) {
      triggerMascotThinking("Sensei here! Ready to diagnose and guide your classroom intervention.");
    }
  };

  // 1. Accessibility & Local Storage Persistence
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReducedMotion(mediaQuery.matches);
      const handleMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      mediaQuery.addEventListener("change", handleMotionChange);

      const savedDisabled = localStorage.getItem("teachsense_mascot_disabled");
      if (savedDisabled === "true") {
        setIsDisabled(true);
      }

      return () => mediaQuery.removeEventListener("change", handleMotionChange);
    }
  }, []);

  // 2. Clamped Pointer Tracking for Eye Vector (passive, no layout lag)
  useEffect(() => {
    if (reducedMotion || isDisabled) return;

    let rafId: number;
    const handleMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setMousePos({ x: e.clientX, y: e.clientY });
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [reducedMotion, isDisabled]);

  // 3. Natural Idle Micro-Behaviors: Blinking & Ear Twitch
  useEffect(() => {
    if (isDisabled) return;

    // Blink timer (every 3.2 - 5.5 seconds)
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 160);
    }, Math.random() * 2300 + 3200);

    // Ear twitch timer (every 6 - 9 seconds)
    const twitchInterval = setInterval(() => {
      setIsEarTwitching(true);
      setTimeout(() => setIsEarTwitching(false), 320);
    }, Math.random() * 3000 + 6000);

    return () => {
      clearInterval(blinkInterval);
      clearInterval(twitchInterval);
    };
  }, [isDisabled]);

  // 4. Context-Aware Movement Calculation using DOM Rects
  const calculateTargetPosition = useCallback(() => {
    if (!mascotTargetId || isDisabled || reducedMotion) {
      setTargetCoords(null);
      return;
    }

    const el = document.getElementById(mascotTargetId);
    if (!el) {
      setTargetCoords(null);
      return;
    }

    const rect = el.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const mascotWidth = 76;
    const mascotHeight = 76;

    // Safe offset placement (prefer right of element, fallback to left if tight)
    let posX = rect.right + 20;
    let posY = rect.top + (rect.height / 2) - (mascotHeight / 2);

    if (posX + mascotWidth + 24 > viewportWidth) {
      // Place to the left if right side overflows
      posX = rect.left - mascotWidth - 20;
    }

    // Clamp inside viewport safe margins
    const clampedX = Math.max(20, Math.min(viewportWidth - mascotWidth - 20, posX));
    const clampedY = Math.max(20, Math.min(viewportHeight - mascotHeight - 90, posY));

    setTargetCoords({ x: clampedX, y: clampedY });
  }, [mascotTargetId, isDisabled, reducedMotion]);

  useEffect(() => {
    calculateTargetPosition();
    window.addEventListener("resize", calculateTargetPosition);
    window.addEventListener("scroll", calculateTargetPosition, { passive: true });

    return () => {
      window.removeEventListener("resize", calculateTargetPosition);
      window.removeEventListener("scroll", calculateTargetPosition);
    };
  }, [calculateTargetPosition]);

  const toggleDisable = () => {
    const nextState = !isDisabled;
    setIsDisabled(nextState);
    if (typeof window !== "undefined") {
      localStorage.setItem("teachsense_mascot_disabled", String(nextState));
    }
  };

  // 5. Clamped Eye Pupil Calculation
  let pupilOffsetX = 0;
  let pupilOffsetY = 0;

  if (mascotRef.current && !reducedMotion && !isBlinking) {
    const rect = mascotRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = mousePos.x - centerX;
    const dy = mousePos.y - centerY;
    const distance = Math.hypot(dx, dy) || 1;
    const maxOffset = 3.4;

    pupilOffsetX = (dx / distance) * Math.min(distance / 50, maxOffset);
    pupilOffsetY = (dy / distance) * Math.min(distance / 50, maxOffset);
  }

  // If disabled, show discreet floating restoration button
  if (isDisabled) {
    return (
      <div
        className="fixed z-50 pointer-events-auto"
        style={{
          right: "max(20px, env(safe-area-inset-right, 20px))",
          bottom: "max(20px, env(safe-area-inset-bottom, 20px))",
        }}
      >
        <button
          onClick={toggleDisable}
          title="Enable Sensei AI Pedagogical Copilot"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-slate-400 hover:text-white hover:border-indigo-500/50 transition shadow-lg backdrop-blur-md cursor-pointer"
        >
          <Bot className="w-3.5 h-3.5 text-indigo-400" />
          <span>Enable Sensei</span>
        </button>
      </div>
    );
  }

  const isWarningOrError = mascotState === "warning" || mascotState === "error";
  const isSuccess = mascotState === "success";
  const isLoading = mascotState === "loading" || mascotState === "thinking";
  const isHelping = mascotState === "helping";

  return (
    <>
      {/* Screen reader notification channel */}
      <div className="sr-only" aria-live="polite">
        {mascotMessage ? `Sensei Copilot says: ${mascotMessage}` : ""}
      </div>

      {/* Pointing Callout Pin on target element when in error/warning state */}
      {targetCoords && isWarningOrError && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed",
            left: targetCoords.x,
            top: targetCoords.y - 32,
            zIndex: 60,
          }}
          className="pointer-events-none flex items-center gap-2 bg-rose-500/90 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-lg shadow-rose-500/30 border border-white/20 backdrop-blur-md"
        >
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          <span>Sensei: Check syntax or missing value here!</span>
        </motion.div>
      )}

      {/* Sensei Rig Container */}
      <motion.div
        ref={mascotRef}
        aria-label="Sensei AI Pedagogical Companion"
        initial={false}
        animate={
          targetCoords && !reducedMotion
            ? { left: targetCoords.x, top: targetCoords.y, bottom: "auto", right: "auto" }
            : { left: "auto", top: "auto" }
        }
        transition={SPRING_CONFIGS.mascot}
        className="fixed z-50 flex flex-col items-end select-none pointer-events-none"
        style={{
          position: "fixed",
          right: targetCoords && !reducedMotion ? undefined : "max(20px, env(safe-area-inset-right, 20px))",
          bottom: targetCoords && !reducedMotion ? undefined : "max(20px, env(safe-area-inset-bottom, 20px))",
        }}
      >
        {/* Contextual Speech Bubble */}
        <AnimatePresence>
          {mascotMessage && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.92 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-auto mb-2 max-w-[260px] sm:max-w-[290px] p-3 rounded-2xl bg-slate-900/95 border border-indigo-500/30 text-xs text-slate-200 shadow-2xl shadow-black/80 backdrop-blur-xl relative"
            >
              <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800">
                <div className="flex items-center gap-1.5 font-bold text-white text-[11px]">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isWarningOrError
                        ? "bg-rose-400"
                        : isSuccess
                        ? "bg-emerald-400"
                        : isHelping
                        ? "bg-cyan-400"
                        : "bg-indigo-400"
                    }`}
                  />
                  Sensei Copilot
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={toggleDisable}
                    title="Mute / Hide Sensei"
                    className="text-slate-500 hover:text-slate-300 transition p-0.5 cursor-pointer"
                    aria-label="Disable mascot"
                  >
                    <EyeOff className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={dismissMascot}
                    className="text-slate-500 hover:text-white transition p-0.5 cursor-pointer"
                    aria-label="Dismiss message"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <p className="text-[11px] leading-relaxed text-slate-300">
                {mascotMessage}
              </p>

              {/* Speech bubble tail */}
              <div className="absolute -bottom-2 right-8 w-3 h-3 bg-slate-900 border-r border-b border-indigo-500/30 rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mascot Character Rig Container */}
        <div className="relative group pointer-events-auto">
          <motion.div
            onClick={handleMascotClick}
            animate={
              !reducedMotion
                ? {
                    y: isWarningOrError ? [0, -4, 0] : [0, -2.5, 0],
                    rotate: isWarningOrError ? [0, -3, 3, 0] : 0,
                  }
                : undefined
            }
            transition={
              !reducedMotion
                ? {
                    y: { repeat: Infinity, duration: 2.2, ease: "easeInOut" },
                    rotate: isWarningOrError ? { duration: 0.4 } : undefined,
                  }
                : undefined
            }
            whileHover={!reducedMotion ? { scale: 1.05 } : undefined}
            whileTap={!reducedMotion ? { scale: 0.95 } : undefined}
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-slate-900 via-indigo-950/90 to-slate-900 border-2 p-1 shadow-2xl cursor-pointer flex items-center justify-center relative overflow-hidden backdrop-blur-md transition-colors ${
              isWarningOrError
                ? "border-rose-500/60 shadow-rose-600/30"
                : isSuccess
                ? "border-emerald-500/60 shadow-emerald-600/30"
                : "border-indigo-500/40 shadow-indigo-600/30"
            }`}
          >
            {/* Ambient inner glow */}
            <div
              className={`absolute inset-0 bg-radial pointer-events-none ${
                isWarningOrError
                  ? "from-rose-500/20 to-transparent"
                  : isSuccess
                  ? "from-emerald-500/20 to-transparent"
                  : "from-indigo-500/20 to-transparent"
              }`}
            />

            {/* SVG Cat Character Rig */}
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full drop-shadow-md"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Ears with twitch animation */}
              <motion.g
                animate={isEarTwitching && !reducedMotion ? { rotate: [-4, 4, 0] } : {}}
                transition={{ duration: 0.3 }}
                style={{ transformOrigin: "26px 40px" }}
              >
                <path
                  d="M26 40 L16 18 L40 26 Z"
                  fill="#1e293b"
                  stroke="#334155"
                  strokeWidth="2"
                />
                <path d="M24 35 L19 23 L34 27 Z" fill="#f472b6" opacity="0.8" />
              </motion.g>

              <motion.g
                animate={isEarTwitching && !reducedMotion ? { rotate: [4, -4, 0] } : {}}
                transition={{ duration: 0.3 }}
                style={{ transformOrigin: "74px 40px" }}
              >
                <path
                  d="M74 40 L84 18 L60 26 Z"
                  fill="#1e293b"
                  stroke="#334155"
                  strokeWidth="2"
                />
                <path d="M76 35 L81 23 L66 27 Z" fill="#f472b6" opacity="0.8" />
              </motion.g>

              {/* Head Base */}
              <ellipse cx="50" cy="54" rx="34" ry="30" fill="#0f172a" stroke="#334155" strokeWidth="2" />

              {/* White muzzle & chest tuft */}
              <ellipse cx="50" cy="62" rx="14" ry="10" fill="#f8fafc" />

              {/* Nose */}
              <polygon points="50,58 46,55 54,55" fill="#f472b6" />
              {/* Mouth */}
              <path d="M46 62 Q50 65 54 62" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />

              {/* Whiskers */}
              <line x1="22" y1="58" x2="36" y2="60" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="20" y1="64" x2="35" y2="63" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="78" y1="58" x2="64" y2="60" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="80" y1="64" x2="65" y2="63" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" />

              {/* Scholar Glasses (Round Wireframes) */}
              <circle cx="36" cy="48" r="11" stroke="#38bdf8" strokeWidth="2" fill="rgba(56, 189, 248, 0.08)" />
              <circle cx="64" cy="48" r="11" stroke="#38bdf8" strokeWidth="2" fill="rgba(56, 189, 248, 0.08)" />
              <line x1="47" y1="48" x2="53" y2="48" stroke="#38bdf8" strokeWidth="2" />

              {/* Eyes & Interactive Pupil Rig */}
              {isBlinking ? (
                // Natural Blink (closed eye lines)
                <>
                  <path d="M30 48 Q36 50 42 48" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M58 48 Q64 50 70 48" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
                </>
              ) : isSuccess ? (
                // Happy curved eyes
                <>
                  <path d="M30 48 Q36 43 42 48" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M58 48 Q64 43 70 48" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
                </>
              ) : isWarningOrError ? (
                // Alert / Concerned eyes
                <>
                  <ellipse cx="36" cy="48" rx="7" ry="7" fill="#f59e0b" />
                  <ellipse cx="64" cy="48" rx="7" ry="7" fill="#f59e0b" />
                  <circle cx="36" cy="48" r="3.5" fill="#020617" />
                  <circle cx="64" cy="48" r="3.5" fill="#020617" />
                </>
              ) : (
                // Dynamic gaze tracking cursor (or centered if reduced motion)
                <>
                  {/* Left Eye */}
                  <ellipse cx="36" cy="48" rx="6.5" ry="6.5" fill="#38bdf8" />
                  <circle
                    cx={36 + pupilOffsetX}
                    cy={48 + pupilOffsetY}
                    r="3.5"
                    fill="#020617"
                  />
                  <circle
                    cx={36 + pupilOffsetX - 1.2}
                    cy={48 + pupilOffsetY - 1.2}
                    r="1.2"
                    fill="#ffffff"
                  />

                  {/* Right Eye */}
                  <ellipse cx="64" cy="48" rx="6.5" ry="6.5" fill="#38bdf8" />
                  <circle
                    cx={64 + pupilOffsetX}
                    cy={48 + pupilOffsetY}
                    r="3.5"
                    fill="#020617"
                  />
                  <circle
                    cx={64 + pupilOffsetX - 1.2}
                    cy={48 + pupilOffsetY - 1.2}
                    r="1.2"
                    fill="#ffffff"
                  />
                </>
              )}

              {/* AI Badge on Collar */}
              <circle cx="50" cy="80" r="5" fill="#6366f1" stroke="#a5b4fc" strokeWidth="1.5" />
              <path d="M48 80 L52 80 M50 78 L50 82" stroke="#ffffff" strokeWidth="1" />
            </svg>

            {/* Reaction Status Indicator Badge */}
            <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-slate-900 border border-indigo-400 flex items-center justify-center text-[10px] shadow">
              {isWarningOrError ? (
                <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
              ) : isSuccess ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : isLoading ? (
                <Brain className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              ) : isHelping ? (
                <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
              ) : (
                <Sparkles className="w-3 h-3 text-cyan-400" />
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
