import { describe, it, expect, vi, beforeEach } from "vitest";
import { mascotBus, MascotEvent } from "@/lib/mascot/mascot-events";

describe("Mascot Event Bus", () => {
  beforeEach(() => {
    mascotBus.clear();
  });

  it("subscribes and receives emitted events", () => {
    const listener = vi.fn();
    const unsubscribe = mascotBus.subscribe(listener);

    mascotBus.emit({
      type: "field:error",
      targetId: "test-input",
      message: "Please provide a valid value",
    });

    expect(listener).toHaveBeenCalledTimes(1);
    const eventArg: MascotEvent = listener.mock.calls[0][0];
    expect(eventArg.type).toBe("field:error");
    expect(eventArg.targetId).toBe("test-input");
    expect(eventArg.state).toBe("warning");
    expect(eventArg.priority).toBe(10);

    unsubscribe();
    mascotBus.emit({
      type: "field:focus",
      targetId: "another-input",
    });
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("maps actions to corresponding mascot visual states correctly", () => {
    expect(mascotBus.mapActionToState("field:error")).toBe("warning");
    expect(mascotBus.mapActionToState("upload:error")).toBe("warning");
    expect(mascotBus.mapActionToState("upload:success")).toBe("success");
    expect(mascotBus.mapActionToState("classification:needs-review")).toBe("helping");
    expect(mascotBus.mapActionToState("field:focus")).toBe("focused");
    expect(mascotBus.mapActionToState("navigation:change")).toBe("observing");
    expect(mascotBus.mapActionToState("interaction:hover")).toBe("following");
    expect(mascotBus.mapActionToState("mascot:reset")).toBe("idle");
  });

  it("deduplicates identical rapid events within throttle interval", () => {
    const listener = vi.fn();
    mascotBus.subscribe(listener);

    mascotBus.emit({
      type: "upload:error",
      message: "Duplicate error test",
      targetId: "drop-zone",
    });

    mascotBus.emit({
      type: "upload:error",
      message: "Duplicate error test",
      targetId: "drop-zone",
    });

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("safely handles throwing listener without breaking other listeners", () => {
    const brokenListener = vi.fn(() => {
      throw new Error("Simulated listener crash");
    });
    const goodListener = vi.fn();

    mascotBus.subscribe(brokenListener);
    mascotBus.subscribe(goodListener);

    expect(() => {
      mascotBus.emit({
        type: "upload:success",
        message: "All good",
      });
    }).not.toThrow();

    expect(brokenListener).toHaveBeenCalled();
    expect(goodListener).toHaveBeenCalled();
  });
});
