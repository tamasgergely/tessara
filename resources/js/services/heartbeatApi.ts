import { apiFetch } from '@/utils/api';

export function sendHeartbeat(): Promise<{ now: string }> {
    return apiFetch(route('heartbeat'));
}
