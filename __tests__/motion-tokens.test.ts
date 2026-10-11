import { describe, it, expect } from "vitest";
import {
  MOTION_TIMINGS,
  MOTION_EASINGS,
  SPRING_CONFIGS,
  fadeInVariants,
  staggerContainerVariants,
  scaleCardVariants,
} from "@/lib/motion/motion-tokens";

describe("Motion Tokens & Animation Config", () => {
  it("defines consistent motion timing constants", () => {
    expect(MOTION_TIMINGS.fast).toBeLessThan(MOTION_TIMINGS.normal);
    expect(MOTION_TIMINGS.normal).toBeLessThan(MOTION_TIMINGS.slow);
    expect(MOTION_TIMINGS.deliberate).toBe(1.0);
  });

  it("exports valid cubic bezier easings", () => {
    expect(MOTION_EASINGS.smoothOut).toHaveLength(4);
    expect(MOTION_EASINGS.gentleOut).toHaveLength(4);
    expect(MOTION_EASINGS.anticipate).toHaveLength(4);
  });

  it("exports valid spring configs", () => {
    expect(SPRING_CONFIGS.snappy).toHaveProperty("type", "spring");
    expect(SPRING_CONFIGS.gentle).toHaveProperty("stiffness");
    expect(SPRING_CONFIGS.bouncy).toHaveProperty("damping");
  });

  it("exports properly structured Framer Motion variants", () => {
    expect(fadeInVariants).toHaveProperty("hidden");
    expect(fadeInVariants).toHaveProperty("visible");
    expect(fadeInVariants).toHaveProperty("exit");

    expect(staggerContainerVariants).toHaveProperty("visible");
    expect(scaleCardVariants).toHaveProperty("hover");
  });
});
