import type { TimerInterval } from "@/types";

export const timerApi = {
    async toggleTimer(timerId: number): Promise<TimerInterval | null> {
        try {
            const csrfToken = (document.querySelector('meta[name=csrf-token]') as HTMLMetaElement)?.content ?? '';

            const response = await fetch(`timers/${timerId}/toggle`, {
                method: 'PATCH',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
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
