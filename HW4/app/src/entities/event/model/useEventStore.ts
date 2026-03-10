import {create} from "zustand";
import {RaffleEvent} from "@/shared/types";

interface EventStore {
    events: RaffleEvent[];
    addEvent: (event: RaffleEvent) => void;
    setEvents: (events: RaffleEvent[]) => void;
    clear: () => void;
}

const MAX_EVENTS = 50;

function normalizeEvents(events: RaffleEvent[]): RaffleEvent[] {
    const deduped = new Map<string, RaffleEvent>();

    for (const event of events) {
        if (!deduped.has(event.id)) {
            deduped.set(event.id, event);
        }
    }

    return Array.from(deduped.values())
        .sort((a, b) => {
            if (b.timestamp !== a.timestamp) return b.timestamp - a.timestamp;
            if (b.blockNumber !== a.blockNumber) return b.blockNumber - a.blockNumber;
            return b.logIndex - a.logIndex;
        })
        .slice(0, MAX_EVENTS);
}

export const useEventStore = create<EventStore>((set) => ({
    events: [],
    addEvent: (event) =>
        set((state) => ({
            events: normalizeEvents([event, ...state.events]),
        })),
    setEvents: (events) => set({events: normalizeEvents(events)}),
    clear: () => set({events: []}),
}));
