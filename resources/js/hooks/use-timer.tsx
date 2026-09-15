import { useState, useRef, useEffect } from 'react';
import type { Timer } from '@/types';
import { clockOffsetMs, elapsedSecondsAt, hasRunningInterval, toHMS } from '@/utils/elapsed';

export function useTimer(initialTimer: Timer) {
    const [timer, setTimer] = useState(initialTimer);
    const clockOffset = useRef(0);

    useEffect(() => {
        setTimer(initialTimer);

        clockOffset.current = clockOffsetMs(
            initialTimer.intervals,
            initialTimer.elapsedTimeAsHMS,
            Date.now()
        );
    }, [
        initialTimer.project_id,
        initialTimer.task_id,
        initialTimer.description,
        initialTimer.project_name,
        initialTimer.task_name,
        initialTimer.client_name,
        initialTimer.intervals
    ]);

    const isRunning = hasRunningInterval(timer.intervals);

    useEffect(() => {
        const refresh = () => setTimer(prev => ({
            ...prev,
            elapsedTimeAsHMS: toHMS(
                elapsedSecondsAt(prev.intervals, Date.now() + clockOffset.current)
            ),
        }));

        refresh();

        if (!isRunning) return;

        // Driven by the paint cycle rather than by a timer: a hidden or
        // minimised window runs no frames at all, and the first frame after it
        // comes back lands before anything reaches the screen. Timers are
        // throttled in that state, and visibilitychange is not dependable when
        // the whole window is minimised rather than the tab switched.
        let frame = 0;
        let shownSecond = -1;

        const tick = () => {
            const second = Math.floor((Date.now() + clockOffset.current) / 1000);

            if (second !== shownSecond) {
                shownSecond = second;
                refresh();
            }

            frame = requestAnimationFrame(tick);
        };

        frame = requestAnimationFrame(tick);

        return () => cancelAnimationFrame(frame);
    }, [isRunning]);

    return {
        timer,
        setTimer,
        isRunning
    };
}
