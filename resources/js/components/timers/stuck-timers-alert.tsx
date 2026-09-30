import type { StuckTimer } from '@/types';
import { TriangleAlert } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { formatToLocalTimeWithDate } from '@/utils/date-formatter';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function StuckTimersAlert({ timers }: { timers: StuckTimer[] }) {
    if (timers.length === 0) return null;

    return (
        <Alert variant="destructive" className="mb-5">
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
                        <span> · running since {formatToLocalTimeWithDate(timer.started_at)}</span>
                    </Link>
                ))}
            </AlertDescription>
        </Alert>
    );
}
