import type { Timer, TimerInterval } from '@/types';
import { useTimer } from '@/hooks/use-timer';
import { useTimerActions } from '@/hooks/use-timer-actions';
import TimerProjectInfo from './timer-project-info';
import TimerIntervals from './timer-intervals';
import TimerDuration from './timer-duration';
import TimerControls from './timer-controls';
import TimerActions from './timer-actions';

type TimerRowProps = {
    initialTimer: Timer,
    onEdit: (timer: Timer) => void,
    onDelete: (item: Timer | TimerInterval) => void
}

export default function TimerRow({ initialTimer, onEdit, onDelete }: TimerRowProps) {

    const { timer, setTimer, workerRef } = useTimer(initialTimer);
    const { handleStart, handleStop } = useTimerActions({ timer, setTimer, workerRef });

    return (
        <div className="2xl:grid-cols-[minmax(300px,350px)_minmax(300px,1fr)_200px_100px_80px_50px] 
                        md:grid-cols-[minmax(220px,1fr)_200px_100px_80px_50px]
                        sm:grid-cols-[minmax(220px,1fr)_200px_100px_40px_50px]
                        grid grid-cols-[1fr_1fr_40px_30px]
                        py-3 border-b border-border last:border-none gap-2 md:gap-5">
            <div className="pr-5 col-span-4 sm:col-span-1">
                <TimerProjectInfo
                    projectName={timer.project_name}
                    clientName={timer.client_name}
                    taskName={timer.task_name} />
            </div>

            <div className="pr-5 hidden 2xl:block">
                {timer.description}
            </div>

            <TimerIntervals
                initalIntervals={timer.intervals}
                onDelete={onDelete}
            />

            <TimerDuration
                hours={timer.elapsedTimeAsHMS.hours}
                minutes={timer.elapsedTimeAsHMS.minutes}
                seconds={timer.elapsedTimeAsHMS.seconds} />

            <TimerControls
                isRunning={!timer.stop}
                onStart={handleStart}
                onStop={handleStop} />

            <TimerActions timer={timer} onEdit={onEdit} onDelete={onDelete} />
        </div >
    );
}