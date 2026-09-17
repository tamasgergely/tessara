import { useState, useRef, useEffect } from 'react';
import type { Timer } from '@/types';
import { clockOffsetMs, elapsedSecondsAt, hasRunningInterval, toHMS } from '@/utils/elapsed';

export function useTimer(initialTimer: Timer) {
    const [intervals, setIntervals] = useState(initialTimer.intervals);
    const [nowMs, setNowMs] = useState(() => Date.now());
    const clockOffset = useRef(0);

    const isRunning = hasRunningInterval(intervals);
    const elapsed = toHMS(elapsedSecondsAt(intervals, nowMs + clockOffset.current));

    useEffect(() => {
        setIntervals(initialTimer.intervals);

        clockOffset.current = clockOffsetMs(
            initialTimer.intervals,
            initialTimer.elapsedTimeAsHMS,
            Date.now()
        );
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
            const now = Date.now();
            const second = Math.floor((now + clockOffset.current) / 1000);

            if (second !== shownSecond) {
                shownSecond = second;
                setNowMs(now);
            }

            frame = requestAnimationFrame(tick);
        };

        frame = requestAnimationFrame(tick);

        return () => cancelAnimationFrame(frame);
    }, [isRunning]);

    return {
        intervals,
        setIntervals,
        isRunning,
        elapsed
    };
}
