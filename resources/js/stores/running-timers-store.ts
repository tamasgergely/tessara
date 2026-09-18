import { create } from 'zustand';

interface RunningTimersState {
    running: Set<number>;
    markRunning: (id: number) => void;
    markStopped: (id: number) => void;
}

export const useRunningTimers = create<RunningTimersState>((set) => ({
    running: new Set<number>(),

    markRunning: (id: number) =>
        set((state) => ({
            running: new Set(state.running).add(id),
        })),

    markStopped: (id: number) =>
        set((state) => {
            const next = new Set(state.running);
            next.delete(id);
            return { running: next };
        }),
}));
