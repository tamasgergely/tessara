import type { ElapsedTimeHMS, TimerInterval } from '@/types';

export function hmsToSeconds({ hours, minutes, seconds }: ElapsedTimeHMS): number {
    return hours * 3600 + minutes * 60 + seconds;
}

export function toHMS(totalSeconds: number): ElapsedTimeHMS {
    const safe = Math.max(0, Math.floor(totalSeconds));

    return {
        hours: Math.floor(safe / 3600),
        minutes: Math.floor((safe % 3600) / 60),
        seconds: safe % 60,
    };
}

export function hasRunningInterval(intervals: TimerInterval[]): boolean {
    return intervals.some((interval) => !interval.stop);
}

/**
 * Total tracked time of a timer at a given moment. A running interval is
 * measured up to `nowMs`, so the result is always derived from the stored
 * timestamps and never from how many times a ticker has fired.
 */
export function elapsedSecondsAt(intervals: TimerInterval[], nowMs: number): number {
    return intervals.reduce((total, interval) => {
        const start = new Date(interval.start).getTime();

        if (!Number.isFinite(start)) return total;

        const stop = interval.stop ? new Date(interval.stop).getTime() : nowMs;

        if (!Number.isFinite(stop)) return total;

        // Truncated per interval rather than over the sum, to match how the
        // server totals the same intervals for the reports page. Clamped so a
        // reversed pair cannot subtract from the total and leave the whole row
        // unreadable while that one interval is being fixed.
        return total + Math.max(0, Math.floor((stop - start) / 1000));
    }, 0);
}

/**
 * Difference between the server's clock and this browser's, in milliseconds.
 *
 * Only a running interval can reveal it: with every interval closed both sides
 * sum the same fixed timestamps, so there is nothing to compare and no skew to
 * correct.
 */
export function clockOffsetMs(
    intervals: TimerInterval[],
    serverElapsed: ElapsedTimeHMS,
    nowMs: number,
): number {
    if (!hasRunningInterval(intervals)) return 0;

    return (hmsToSeconds(serverElapsed) - elapsedSecondsAt(intervals, nowMs)) * 1000;
}
