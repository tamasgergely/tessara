import { useCallback } from 'react';
import type { Timer, TimerInterval } from '@/types';
import { timerApi } from '@/services/timerApi';

type UseTimerActionsProps = {
    timer: Timer;
    setTimer: React.Dispatch<React.SetStateAction<Timer>>;
};

export function useTimerActions({ timer, setTimer }: UseTimerActionsProps) {

    const updateIntervalState = useCallback((updatedInterval: TimerInterval, action: 'start' | 'stop') => {
        const index = timer.intervals.findIndex(interval => interval.id === updatedInterval.id);
        const updatedIntervals = [...timer.intervals];

        if (index !== -1) {
            updatedIntervals[index] = {
                ...updatedIntervals[index],
                stop: updatedInterval.stop
            };
        } else {
            updatedIntervals.push(updatedInterval);
        }

        setTimer(prev => ({ ...prev, intervals: updatedIntervals, stop: action === 'stop' ? true : null }));

    }, [timer.intervals, setTimer]);

    const handleStart = useCallback(async () => {
        if (!timer.intervals?.length) {
            console.error('No intervals available');
            return;
        }

        const updatedInterval = await timerApi.toggleTimer(timer.id);

        if (updatedInterval) {
            updateIntervalState(updatedInterval, 'start');
        }
    }, [timer.intervals, setTimer, updateIntervalState]);

    const handleStop = useCallback(async () => {
        if (!timer.intervals?.length) {
            console.error('No intervals available');
            return;
        }

        const updatedInterval = await timerApi.toggleTimer(timer.id);

        if (updatedInterval) {
            updateIntervalState(updatedInterval, 'stop');
        }
    }, [timer.intervals, setTimer, updateIntervalState]);

    return {
        handleStart,
        handleStop
    };
}