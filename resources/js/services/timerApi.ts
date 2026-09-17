import type { TimerInterval } from "@/types";
import { apiFetch } from "@/utils/api";

export function toggleTimer(timerId: number): Promise<TimerInterval> {
    return apiFetch(`/timers/${timerId}/toggle`, { method: 'PATCH' });
}

export function updateIntervalTime(intervalId: number, field: 'start' | 'stop', value: string): Promise<TimerInterval>{
    return apiFetch(`/time-intervals/update-time/${intervalId}`, {
        method: 'PATCH', 
        body: {[field]: value}
    });
}
