import { describe, it, expect } from "vitest";
import {
  MOTION_TIMINGS,
  MOTION_EASINGS,
  SPRING_CONFIGS,
  fadeInVariants,
  staggerContainerVariants,
  scaleCardVariants,
  routeTransitionVariants,
  heroEntranceVariants,
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
    expect(SPRING_CONFIGS.mascot).toHaveProperty("stiffness");
  });

  it("exports properly structured Framer Motion variants", () => {
    expect(fadeInVariants).toHaveProperty("hidden");
    expect(fadeInVariants).toHaveProperty("visible");
    expect(fadeInVariants).toHaveProperty("exit");

    expect(staggerContainerVariants).toHaveProperty("visible");
    expect(scaleCardVariants).toHaveProperty("hover");
    expect(routeTransitionVariants).toHaveProperty("initial");
    expect(routeTransitionVariants).toHaveProperty("animate");
    expect(routeTransitionVariants).toHaveProperty("exit");
  });

  it("evaluates heroEntranceVariants dynamic function correctly", () => {
    expect(heroEntranceVariants).toHaveProperty("hidden");
    if (typeof heroEntranceVariants.visible === "function") {
      const visibleFn = heroEntranceVariants.visible as any;
      const result0 = visibleFn(0);
      expect(result0).toHaveProperty("opacity", 1);
      const result2 = visibleFn(2);
      expect(result2).toHaveProperty("opacity", 1);
    }
  });
});
