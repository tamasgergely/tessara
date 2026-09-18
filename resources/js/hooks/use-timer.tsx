import { useState, useEffect } from 'react';
import type { Timer } from '@/types';
import { clockOffsetMs, elapsedSecondsAt, hasRunningInterval, toHMS } from '@/utils/elapsed';
import { serverNow, setClockOffset } from '@/utils/clock';
import { useRunningTimers } from '@/stores/running-timers-store';

export function useTimer(initialTimer: Timer) {
    const [intervals, setIntervals] = useState(initialTimer.intervals);
    const [nowMs, setNowMs] = useState(() => serverNow());

    const isRunning = hasRunningInterval(intervals);
    const elapsed = toHMS(elapsedSecondsAt(intervals, nowMs));

    const markRunning = useRunningTimers(state => state.markRunning);
    const markStopped = useRunningTimers(state => state.markStopped);

    useEffect(() => {
        setIntervals(initialTimer.intervals);

        const measured = clockOffsetMs(
            initialTimer.intervals,
            initialTimer.elapsedTimeAsHMS,
            Date.now()
        );

        if (measured !== null) setClockOffset(measured);
    }, [initialTimer.intervals]);

    useEffect(() => {
        if (!isRunning) return;

        // Paint cycle, not a timer: timers throttle in a hidden window, and
        // visibilitychange is unreliable when it is minimised rather than
        // switched. Hidden windows run no frames, and the first frame back
        // already paints the correct value.
        let frame = 0;
        let shownSecond = -1;

        const tick = () => {
            const now = serverNow();
            const second = Math.floor(now / 1000);

            if (second !== shownSecond) {
                shownSecond = second;
                setNowMs(now);
            }

            frame = requestAnimationFrame(tick);
        };

        frame = requestAnimationFrame(tick);

        return () => cancelAnimationFrame(frame);
    }, [isRunning]);


    useEffect(() => {
        if (!isRunning) return;

        markRunning(initialTimer.id);

        return () => markStopped(initialTimer.id);
    }, [isRunning, initialTimer.id, markRunning, markStopped]);

    return {
        intervals,
        setIntervals,
        isRunning,
        elapsed
    };
}
