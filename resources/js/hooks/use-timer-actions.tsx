import { useCallback, useState, useRef } from 'react';
import type { TimerInterval } from '@/types';
import { timerApi } from '@/services/timerApi';

type UseTimerActionsProps = {
    timerId: number;
    setIntervals: React.Dispatch<React.SetStateAction<TimerInterval[]>>;
};

export function useTimerActions({ timerId, setIntervals }: UseTimerActionsProps) {
    const [pending, setPending] = useState(false);
    const inFlight = useRef(false);

    const toggle = useCallback(async () => {
        if (inFlight.current) return;
        inFlight.current = true;
        setPending(true);

        try {
            const updatedInterval = await timerApi.toggleTimer(timerId);

            if (!updatedInterval) return;

            setIntervals(prev => {
                const exists = prev.some(interval => interval.id === updatedInterval.id);

                if (!exists) return [...prev, updatedInterval];

                return prev.map(interval =>
                    interval.id === updatedInterval.id
                        ? { ...interval, stop: updatedInterval.stop }
                        : interval
                );
            });
        } finally {
            inFlight.current = false;
            setPending(false);
        }
    }, [timerId, setIntervals]);

    return { toggle, pending };
}