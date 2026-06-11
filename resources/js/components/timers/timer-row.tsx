import type { Timer, TimerInterval } from '@/types';
import { useState } from 'react';
import { useTimer } from '@/hooks/use-timer';
import { useTimerActions } from '@/hooks/use-timer-actions';
import TimerProjectInfo from './timer-project-info';
import TimerIntervals from './timer-intervals';
import TimerDuration from './timer-duration';
import TimerControls from './timer-controls';
import TimerActions from './timer-actions';
import { ChevronRight } from 'lucide-react';

type TimerRowProps = {
    initialTimer: Timer,
    onEdit: (timer: Timer) => void,
    onDelete: (item: Timer | TimerInterval) => void
}

export default function TimerRow({ initialTimer, onEdit, onDelete }: TimerRowProps) {

    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    const { timer, setTimer, workerRef } = useTimer(initialTimer);
    const { handleStart, handleStop } = useTimerActions({ timer, setTimer, workerRef });

    const handleIntervalUpdate = (updatedInterval: TimerInterval) => {
        setTimer(prev => {
            const updatedIntervals = prev.intervals.map(i =>
                i.id === updatedInterval.id ? updatedInterval : i
            );

            const totalSeconds = updatedIntervals.reduce((sum, interval) => {
                const start = new Date(interval.start).getTime();
                const stop = interval.stop ? new Date(interval.stop).getTime() : Date.now();
                return sum + Math.floor((stop - start) / 1000);
            }, 0);

            return {
                ...prev,
                intervals: updatedIntervals,
                elapsedTimeAsHMS: {
                    hours: Math.floor(totalSeconds / 3600),
                    minutes: Math.floor((totalSeconds % 3600) / 60),
                    seconds: totalSeconds % 60,
                }
            };
        });
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
                                xl:grid-cols-[minmax(200px,400px)_minmax(250px,1fr)_100px_80px_30px]
                                md:grid-cols-[minmax(200px,1fr)_200px_80px_30px_30px] md:gap-x-5
                                grid grid-cols-[1fr_1fr_40px_30px]
                                py-3 gap-2 w-full">
                    <div className="order-1 col-span-4 md:col-span-1">
                        <TimerProjectInfo
                            projectName={timer.project_name}
                            clientName={timer.client_name}
                            taskName={timer.task_name} />
                    </div>
                    <div className={`order-6 col-span-4 md:col-span-5 xl:order-2 xl:col-span-1 ${!timer.description ? 'hidden sm:block' : 'block'}`}>
                        <p className="text-sm line-clamp-2 whitespace-pre-line text-muted-foreground leading-snug">
                            {timer.description}
                        </p>
                    </div>
                    <div className="order-3 col-span-1 text-base self-center text-primary text-right md:col-span-1 md:text-left md:text-xl lg:order-4">
                        <TimerDuration
                            hours={timer.elapsedTimeAsHMS.hours}
                            minutes={timer.elapsedTimeAsHMS.minutes}
                            seconds={timer.elapsedTimeAsHMS.seconds} />
                    </div>
                    <div className="order-4 col-span-1 flex items-center">
                        <TimerControls
                            isRunning={!timer.stop}
                            onStart={handleStart}
                            onStop={handleStop} />
                    </div>
                    <div className="order-5 col-span-1 flex items-center">
                        <TimerActions
                            timer={timer}
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
                            initalIntervals={timer.intervals}
                            onDelete={onDelete}
                            onUpdate={handleIntervalUpdate}
                        />
                    </div>
                    {timer.description && (
                        <div>
                            <div className="text-xs text-muted-foreground mb-2">DESCRIPTION</div>
                            <p className="text-sm whitespace-pre-line text-foreground leading-relaxed">
                                {timer.description}
                            </p>
                        </div>
                    )}
                </div >
            )}
        </div>
    );
}