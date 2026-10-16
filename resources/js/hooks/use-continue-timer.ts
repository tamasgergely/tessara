import { router } from '@inertiajs/react';
import { useCallback, useRef, useState } from 'react';

export function useContinueTimer() {
    const [pending, setPending] = useState(false);
    const inFlight = useRef(false);

    const continueTimer = useCallback(
        (timerId: number) => {
            if (inFlight.current) return;
            inFlight.current = true;
            setPending(true);

            router.post(
                route('timers.continue', { timer: timerId }),
                {},
                {
                    onFinish: () => {
                        inFlight.current = false;
                        setPending(false);
                    },
                    preserveState: true,
                    preserveScroll: true,
                },
            );
        },
        [],
    );

    return { continueTimer, pending };
}
