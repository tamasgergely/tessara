import type { StuckTimer } from '@/types';
import { TriangleAlert } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { formatDateTime } from '@/utils/date-formatter';

export default function StuckTimersAlert({ timers }: { timers: StuckTimer[] }) {
    if (timers.length === 0) return null;

    return (
        <Alert variant="destructive" className="mt-5">
            <TriangleAlert />
            <AlertTitle>These timers have been running for a long time</AlertTitle>
            <AlertDescription>
                {timers.map(timer => (
                    <Link
                        key={timer.id}
                        href={route('timers.index', { date: timer.date })}
                        className="block hover:underline hover:decoration-foreground"
                    >
                        <span className="font-medium text-foreground">{timer.task_name}</span>
                        {timer.client_name && <span> · <span className="text-primary">{timer.client_name}</span></span>}
                        <span> · running since {formatDateTime(timer.started_at)}</span>
                    </Link>
                ))}
                <p className="mt-1 text-xs">
                    Open the entry on its day and set the real end time in its intervals.
                </p>
            </AlertDescription>
        </Alert>
    );
}
