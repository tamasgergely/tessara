import { sendHeartbeat } from '@/services/heartbeatApi';
import { useRunningTimers } from '@/stores/running-timers-store';
import { ApiError } from '@/utils/api';
import { setClockOffset } from '@/utils/clock';
import { sessionExpiredToast } from '@/utils/session-toast';
import { useEffect } from 'react';

const HEARTBEAT_INTERVAL_MS = 5 * 60 * 1000;

export function useHeartbeat() {
    const anyRunning = useRunningTimers((state) => state.running.size > 0);

    useEffect(() => {
        if (!anyRunning) return;

        const beat = async () => {
            try {
                const { now } = await sendHeartbeat();
                setClockOffset(new Date(now).getTime() - Date.now());
            } catch (error) {
                if (error instanceof ApiError && error.sessionExpired) {
                    sessionExpiredToast();
                }

                // Anything else stays silent on purpose: this beat is background
                // work the user never asked for, and the next one retries. Only an
                // expired session needs saying, because it will not heal on its own.
            }
        };

        const id = setInterval(beat, HEARTBEAT_INTERVAL_MS);

        return () => clearInterval(id);
    }, [anyRunning]);
}
