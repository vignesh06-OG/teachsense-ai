"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface HeroTypingHeadingProps {
  text: string;
  highlightText?: string;
  className?: string;
  speedMs?: number;
  as?: "h1" | "h2" | "h3";
}

/**
 * Accessible hero typewriter effect that types out smoothly ONCE,
 * provides full text to screen readers immediately, and respects reduced motion preferences.
 */
export function HeroTypingHeading({
  text,
  highlightText,
  className = "",
  speedMs = 38,
  as: Component = "h1",
}: HeroTypingHeadingProps) {
  const shouldReduceMotion = useReducedMotion();
  const fullText = highlightText ? `${text} ${highlightText}` : text;
  const [displayedLength, setDisplayedLength] = useState(shouldReduceMotion ? fullText.length : 0);
  const [isComplete, setIsComplete] = useState(!!shouldReduceMotion);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayedLength(fullText.length);
      setIsComplete(true);
      return;
    }

    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex += 1;
      setDisplayedLength(currentIndex);
      if (currentIndex >= fullText.length) {
        clearInterval(interval);
        setIsComplete(true);
      }
    }, speedMs);

    return () => clearInterval(interval);
  }, [fullText, speedMs, shouldReduceMotion]);

  if (shouldReduceMotion) {
    return (
      <Component className={className} aria-label={fullText}>
        <span>{text} </span>
        {highlightText && (
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-purple-400">
            {highlightText}
          </span>
        )}
      </Component>
    );
  }

  // Calculate slice for base text and highlight text
  const baseLen = text.length;
  const showBase = fullText.slice(0, Math.min(displayedLength, baseLen));
  const showHighlight = displayedLength > baseLen ? fullText.slice(baseLen + 1, displayedLength) : "";

  return (
    <Component className={className} aria-label={fullText}>
      {/* Screen reader full text fallback */}
      <span className="sr-only">{fullText}</span>

      {/* Visual animated typewriter */}
      <span aria-hidden="true">
        <span>{showBase}</span>
        {highlightText && showHighlight && (
          <>
            {" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-purple-400">
              {showHighlight}
            </span>
          </>
        )}
        {!isComplete && (
          <span className="inline-block w-[3px] h-[0.85em] ml-1 bg-cyan-400 align-middle animate-pulse" />
        )}
      </span>
    </Component>
  );
}

interface StaggeredWordHeadingProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3";
}

/**
 * Staggered word-by-word reveal for secondary headings
 */
export function StaggeredWordHeading({
  text,
  className = "",
  as: Component = "h2",
}: StaggeredWordHeadingProps) {
  const shouldReduceMotion = useReducedMotion();
  const words = text.split(" ");

  if (shouldReduceMotion) {
    return <Component className={className}>{text}</Component>;
  }

  return (
    <Component className={className} aria-label={text}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="inline-block">
        {words.map((word, idx) => (
          <motion.span
            key={idx}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{
              duration: 0.35,
              delay: idx * 0.05,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="inline-block mr-[0.28em] last:mr-0"
          >
            {word}
          </motion.span>
        ))}
      </span>
    </Component>
  );
}

interface CountUpProps {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
}

/**
 * Numerical count-up component that runs when real values are stable,
 * with screen reader accessibility and reduced-motion fallback.
 */
export function CountUp({
  value,
  suffix = "",
  prefix = "",
  decimals = 0,
  duration = 1.2,
  className = "",
}: CountUpProps) {
  const shouldReduceMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(shouldReduceMotion ? value : 0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayValue(value);
      return;
    }

    let start = 0;
    const startTime = performance.now();
    const durationMs = duration * 1000;

    const updateCounter = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (value - start) * eased;

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setDisplayValue(value);
        setHasAnimated(true);
      }
    };

    const animFrame = requestAnimationFrame(updateCounter);
    return () => cancelAnimationFrame(animFrame);
  }, [value, duration, shouldReduceMotion]);

  const formatted = `${prefix}${displayValue.toFixed(decimals)}${suffix}`;
  const finalFormatted = `${prefix}${value.toFixed(decimals)}${suffix}`;

  return (
    <span ref={ref} className={className} aria-label={finalFormatted}>
      <span className="sr-only">{finalFormatted}</span>
      <span aria-hidden="true">{formatted}</span>
    </span>
  );
}

interface SectionRevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

/**
 * Viewport intersection reveal wrapper for dashboard cards and sections
 */
export function SectionReveal({
  children,
  delay = 0,
  className = "",
}: SectionRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.45,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
