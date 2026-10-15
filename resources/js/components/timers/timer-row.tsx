import { useTimer } from '@/hooks/use-timer';
import { useTimerActions } from '@/hooks/use-timer-actions';
import type { Timer, TimerInterval } from '@/types';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';
import TimerActions from './timer-actions';
import TimerControls from './timer-controls';
import TimerDuration from './timer-duration';
import TimerIntervals from './timer-intervals';
import TimerProjectInfo from './timer-project-info';

type TimerRowProps = {
    initialTimer: Timer,
    isPastDay: boolean,
    onEdit: (timer: Timer) => void,
    onDelete: (item: Timer | TimerInterval) => void
}

export default function TimerRow({ initialTimer, isPastDay, onEdit, onDelete }: TimerRowProps) {

    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    const { intervals, setIntervals, isRunning, elapsed } = useTimer(initialTimer);
    const { toggle, continueTimer, pending } = useTimerActions({ timerId: initialTimer.id, setIntervals });

    const handleIntervalUpdate = (updatedInterval: TimerInterval) => {
        setIntervals(prevIntervals =>
            prevIntervals.map(interval =>
                interval.id === updatedInterval.id ? updatedInterval : interval
            )
        );
    };

    return (
        <div className="border-b border-border last:border-none">
            <div className="flex items-center gap-3">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="cursor-pointer w-5">
                    <ChevronRight
                        className={`h-5 w-5 text-muted-foreground pointer transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                    />
                </button>
                <div className="2xl:gap-x-10
                                xl:grid-cols-[minmax(200px,400px)_minmax(250px,1fr)_100px_110px_30px]
                                md:grid-cols-[minmax(200px,1fr)_200px_80px_30px_30px] md:gap-x-5
                                grid grid-cols-[1fr_1fr_40px_30px]
                                py-3 gap-2 w-full">
                    <div className="order-1 col-span-4 md:col-span-1">
                        <TimerProjectInfo
                            projectName={initialTimer.project_name}
                            clientName={initialTimer.client_name}
                            taskName={initialTimer.task_name} />
                    </div>
                    <div className={`order-6 col-span-4 md:col-span-5 xl:order-2 xl:col-span-1 ${!initialTimer.description ? 'hidden sm:block' : 'block'}`}>
                        <p className="text-sm line-clamp-2 whitespace-pre-line text-foreground leading-snug">
                            {initialTimer.description}
                        </p>
                    </div>
                    <div className="order-3 col-span-1 text-base self-center text-primary text-right md:col-span-1 md:text-left md:text-xl lg:order-4">
                        <TimerDuration
                            hours={elapsed.hours}
                            minutes={elapsed.minutes}
                            seconds={elapsed.seconds} />
                    </div>
                    <div className="order-4 col-span-1 flex items-center">
                        <TimerControls
                            isRunning={isRunning}
                            isPastDay={isPastDay}
                            pending={pending}
                            toggle={toggle}
                            continueTimer={continueTimer} />
                    </div>
                    <div className="order-5 col-span-1 flex items-center">
                        <TimerActions
                            timer={initialTimer}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    </div>
                </div>
            </div>
            {isExpanded && (
                <div className="pt-2 pb-4 space-y-4 pl-10">
                    <div className="order-2 col-span-1 md:col-span-1 lg:order-3">
                        <div className="text-xs text-muted-foreground mb-3">INTERVALS</div>
                        <TimerIntervals
                            initialIntervals={intervals}
                            onDelete={onDelete}
                            onUpdate={handleIntervalUpdate}
                        />
                    </div>
                    {initialTimer.description && (
                        <div>
                            <div className="text-xs text-muted-foreground mb-2">DESCRIPTION</div>
                            <p className="text-sm whitespace-pre-line text-foreground leading-relaxed">
                                {initialTimer.description}
                            </p>
                        </div>
                    )}
                </div >
            )}
        </div>
    );
}