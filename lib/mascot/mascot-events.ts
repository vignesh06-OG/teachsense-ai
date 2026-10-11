export type MascotStateType =
  | "idle"
  | "observing"
  | "following"
  | "focused"
  | "helping"
  | "warning"
  | "success"
  | "loading"
  | "sleeping";

export type MascotEventAction =
  | "field:error"
  | "field:focus"
  | "upload:error"
  | "upload:success"
  | "workflow:blocked"
  | "classification:needs-review"
  | "materials:ready"
  | "analysis:complete"
  | "navigation:change"
  | "interaction:hover"
  | "mascot:reset";

export interface MascotEvent {
  type: MascotEventAction;
  targetId?: string;
  message?: string;
  state?: MascotStateType;
  priority?: number; // Higher number = higher priority (e.g. 10 = critical error, 1 = idle hover)
  timestamp?: number;
}

export type MascotEventListener = (event: MascotEvent) => void;

class MascotEventBus {
  private listeners: Set<MascotEventListener> = new Set();
  private lastEvent: MascotEvent | null = null;
  private lastEventTime = 0;

  /**
   * Subscribe to mascot events. Returns an unsubscribe function.
   */
  subscribe(listener: MascotEventListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Dispatch an event to all subscribers with throttling & deduplication for rapid repeated errors.
   */
  emit(event: MascotEvent): void {
    const now = Date.now();
    const eventWithTime: MascotEvent = {
      ...event,
      timestamp: now,
      priority: event.priority ?? (event.type.includes("error") || event.type.includes("blocked") ? 10 : 3),
      state: event.state ?? this.mapActionToState(event.type),
    };

    // Deduplicate identical error messages within 1.2s to prevent animation storms
    if (
      this.lastEvent &&
      this.lastEvent.type === event.type &&
      this.lastEvent.message === event.message &&
      this.lastEvent.targetId === event.targetId &&
      now - this.lastEventTime < 1200
    ) {
      return;
    }

    this.lastEvent = eventWithTime;
    this.lastEventTime = now;

    this.listeners.forEach((listener) => {
      try {
        listener(eventWithTime);
      } catch (err) {
        console.warn("Mascot event listener error:", err);
      }
    });
  }

  /**
   * Helper to map action type to appropriate default mascot visual state
   */
  mapActionToState(action: MascotEventAction): MascotStateType {
    switch (action) {
      case "field:error":
      case "upload:error":
      case "workflow:blocked":
        return "warning";
      case "upload:success":
      case "materials:ready":
      case "analysis:complete":
        return "success";
      case "classification:needs-review":
        return "helping";
      case "field:focus":
        return "focused";
      case "navigation:change":
        return "observing";
      case "interaction:hover":
        return "following";
      case "mascot:reset":
      default:
        return "idle";
    }
  }

  /**
   * Clear all listeners (for testing cleanup)
   */
  clear(): void {
    this.listeners.clear();
    this.lastEvent = null;
    this.lastEventTime = 0;
  }
}

export const mascotBus = new MascotEventBus();
