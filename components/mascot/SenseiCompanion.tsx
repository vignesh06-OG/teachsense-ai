"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, AlertCircle, CheckCircle2, Brain, X, EyeOff, Bot } from "lucide-react";
import { useWorkflow, MascotState } from "@/lib/context/WorkflowContext";

export function SenseiCompanion() {
  const {
    mascotState,
    mascotMessage,
    mascotTargetId,
    setMascotState,
    dismissMascot,
  } = useWorkflow();

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isDisabled, setIsDisabled] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const mascotRef = useRef<HTMLDivElement>(null);

  // Check reduced motion preference & saved disabled state
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

  // Track cursor position for eye vector calculation (if not reduced motion)
  useEffect(() => {
    if (reducedMotion || isDisabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [reducedMotion, isDisabled]);

  // Update target rect if an element target is specified
  useEffect(() => {
    if (!mascotTargetId || isDisabled) {
      setTargetRect(null);
      return;
    }

    const updateTarget = () => {
      const el = document.getElementById(mascotTargetId);
      if (el) {
        setTargetRect(el.getBoundingClientRect());
      }
    };

    updateTarget();
    window.addEventListener("resize", updateTarget);
    window.addEventListener("scroll", updateTarget);

    return () => {
      window.removeEventListener("resize", updateTarget);
      window.removeEventListener("scroll", updateTarget);
    };
  }, [mascotTargetId, isDisabled]);

  const toggleDisable = () => {
    const nextState = !isDisabled;
    setIsDisabled(nextState);
    if (typeof window !== "undefined") {
      localStorage.setItem("teachsense_mascot_disabled", String(nextState));
    }
  };

  // Calculate eye pupil offset relative to mascot on screen
  let pupilOffsetX = 0;
  let pupilOffsetY = 0;

  if (mascotRef.current && !reducedMotion) {
    const rect = mascotRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = mousePos.x - centerX;
    const dy = mousePos.y - centerY;
    const distance = Math.hypot(dx, dy) || 1;
    const maxOffset = 3.5;
    pupilOffsetX = (dx / distance) * Math.min(distance / 50, maxOffset);
    pupilOffsetY = (dy / distance) * Math.min(distance / 50, maxOffset);
  }

  // If disabled, show discreet floating restoration button
  if (isDisabled) {
    return (
      <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50">
        <button
          onClick={toggleDisable}
          title="Enable Sensei AI Pedagogical Copilot"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-slate-400 hover:text-white hover:border-indigo-500/50 transition shadow-lg backdrop-blur-md"
        >
          <Bot className="w-3.5 h-3.5 text-indigo-400" />
          <span>Enable Sensei</span>
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Target pointing callout indicator if target element exists */}
      {targetRect && mascotState === "error" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed",
            left: targetRect.left - 12,
            top: targetRect.top - 36,
            zIndex: 60,
          }}
          className="pointer-events-none flex items-center gap-2 bg-rose-500/90 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-rose-500/30 border border-white/20 backdrop-blur-md"
        >
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          <span>Sensei: Check syntax here!</span>
        </motion.div>
      )}

      {/* Docked Companion Widget */}
      <div
        ref={mascotRef}
        aria-label="Sensei AI Pedagogical Mascot"
        className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end select-none"
      >
        {/* Speech Bubble */}
        <AnimatePresence>
          {mascotMessage && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="mb-2 max-w-[260px] sm:max-w-[280px] p-3 rounded-2xl bg-slate-900/95 border border-indigo-500/30 text-xs text-slate-200 shadow-xl shadow-black/60 backdrop-blur-xl relative"
            >
              <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800">
                <div className="flex items-center gap-1.5 font-bold text-white text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-indigo-400" />
                  Sensei (AI Copilot)
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={toggleDisable}
                    title="Mute / Hide Sensei"
                    className="text-slate-500 hover:text-slate-300 transition p-0.5"
                    aria-label="Disable mascot"
                  >
                    <EyeOff className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={dismissMascot}
                    className="text-slate-500 hover:text-white transition p-0.5"
                    aria-label="Dismiss message"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <p className="text-[11px] leading-relaxed text-slate-300">
                {mascotMessage}
              </p>

              {/* Speech bubble tail pointer */}
              <div className="absolute -bottom-2 right-8 w-3 h-3 bg-slate-900 border-r border-b border-indigo-500/30 rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mascot Character Rig Container */}
        <div className="relative group">
          <motion.div
            whileHover={!reducedMotion ? { scale: 1.05 } : undefined}
            whileTap={!reducedMotion ? { scale: 0.95 } : undefined}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-slate-900 via-indigo-950/80 to-slate-900 border-2 border-indigo-500/40 p-1 shadow-2xl shadow-indigo-600/30 cursor-pointer flex items-center justify-center relative overflow-hidden backdrop-blur-md"
          >
            {/* Ambient inner glow */}
            <div className="absolute inset-0 bg-radial from-indigo-500/20 to-transparent pointer-events-none" />

            {/* SVG Cat Character Rig */}
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full drop-shadow-md"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Ears */}
              <path
                d="M26 40 L16 18 L40 26 Z"
                fill="#1e293b"
                stroke="#334155"
                strokeWidth="2"
              />
              <path d="M24 35 L19 23 L34 27 Z" fill="#f472b6" opacity="0.8" />

              <path
                d="M74 40 L84 18 L60 26 Z"
                fill="#1e293b"
                stroke="#334155"
                strokeWidth="2"
              />
              <path d="M76 35 L81 23 L66 27 Z" fill="#f472b6" opacity="0.8" />

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
              {mascotState === "success" ? (
                // Happy closed curved eyes
                <>
                  <path d="M30 48 Q36 43 42 48" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M58 48 Q64 43 70 48" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
                </>
              ) : mascotState === "error" ? (
                // Alert / Surprised wide eyes
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

            {/* Reaction Icon Indicator Badge */}
            <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-slate-900 border border-indigo-400 flex items-center justify-center text-[10px]">
              {mascotState === "error" ? (
                <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
              ) : mascotState === "success" ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : mascotState === "thinking" ? (
                <Brain className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              ) : (
                <Sparkles className="w-3 h-3 text-cyan-400" />
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
