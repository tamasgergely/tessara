import type { RecentTask } from '@/types';
import { History } from 'lucide-react';
import { useContinueTimer } from '@/hooks/use-continue-timer';

export default function RecentTasks({ tasks }: { tasks: RecentTask[] }) {
    const { continueTimer, pending } = useContinueTimer();

    if (tasks.length === 0) return null;

    return (
        <div className="mt-5 flex items-center gap-3 px-2 lg:px-0">
            <span className="flex shrink-0 items-center gap-1.5 text-sm text-muted-foreground">
                <History className="size-4" aria-hidden="true" />
                Continue
            </span>

            <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:flex-wrap md:overflow-visible">
                {tasks.map(task => (
                    <button
                        key={task.id}
                        type="button"
                        onClick={() => continueTimer(task.timer_id)}
                        disabled={pending}
                        title={`Start a new entry today: ${task.task_name}`}
                        className="flex shrink-0 cursor-pointer items-baseline gap-1.5 rounded-full border border-border bg-list px-3 py-1.5 text-sm transition-colors hover:border-primary hover:text-primary disabled:cursor-wait disabled:opacity-60"
                    >
                        <span className="max-w-56 truncate font-medium">{task.task_name}</span>
                        {task.client_name && (
                            <span className="max-w-32 truncate text-xs text-muted-foreground">{task.client_name}</span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
