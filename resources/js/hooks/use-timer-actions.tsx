import { useCallback, useState, useRef } from 'react';
import type { TimerInterval } from '@/types';
import { toggleTimer } from '@/services/timerApi';
import { ApiError } from '@/utils/api';
import toast from 'react-hot-toast';
import { sessionExpiredToast } from '@/utils/session-toast';
import { router } from '@inertiajs/react';

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
            const updatedInterval = await toggleTimer(timerId);

            setIntervals(prev => {
                const exists = prev.some(interval => interval.id === updatedInterval.id);

                if (!exists) return [...prev, updatedInterval];

                return prev.map(interval =>
                    interval.id === updatedInterval.id
                        ? { ...interval, stop: updatedInterval.stop }
                        : interval
                );
            });

            if (updatedInterval.stop == null) {
                router.reload({ only: ['timers'] });
            }

        } catch (error) {
            if (!(error instanceof ApiError)) throw error;

            if (error.sessionExpired) {
                sessionExpiredToast();
            } else {
                toast.error(error.message);
            }
        } finally {
            inFlight.current = false;
            setPending(false);
        }
    }, [timerId, setIntervals]);

    return { toggle, pending };
}