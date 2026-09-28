import type { SharedData } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';

export function useTimezoneSync() {
    const { auth } = usePage<SharedData>().props;
    const savedTimezone = auth.user.preferences?.timezone;
    const attempted = useRef(false);

    useEffect(() => {
        if (savedTimezone || attempted.current) return;

        // Inertia initialises its router in the root component's effect, which runs after this one.
        const timeout = setTimeout(() => {
            attempted.current = true;
            router.patch(
                route('settings.preferences.update'),
                {
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                },
                { preserveState: true, preserveScroll: true, async: true, only: ['auth'] },
            );
        }, 0);

        return () => clearTimeout(timeout);
    }, [savedTimezone]);
}
