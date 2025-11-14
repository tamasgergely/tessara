import type { TimerInterval } from "@/types";
import { getCookie } from "@/utils/cookie";

export const timerApi = {
    async toggleTimer(timerId: number): Promise<TimerInterval | null> {
        try {
            const csrfToken = getCookie('XSRF-TOKEN');

            const response = await fetch(`timers/${timerId}/toggle`, {
                method: 'PATCH',
                headers: {
                    'X-XSRF-TOKEN': csrfToken,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                console.error('Failed to update interval:', response.statusText);
                return null;
            }

            const data = await response.json();

            return data;

        } catch (error) {
            console.error('Network or fetch error:', error);
            return null;
        }
    }
};