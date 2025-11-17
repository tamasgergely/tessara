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
        <div className="2xl:gap-x-10
                        xl:grid-cols-[minmax(200px,350px)_minmax(250px,1fr)_200px_80px_80px_30px]
                        md:grid-cols-[minmax(200px,1fr)_200px_80px_30px_30px] md:gap-x-5
                        grid grid-cols-[1fr_1fr_40px_30px]
                        py-3 border-b border-border last:border-none gap-2">
            
            <div className="order-1 col-span-4 md:col-span-1">
                <TimerProjectInfo
                    projectName={timer.project_name}
                    clientName={timer.client_name}
                    taskName={timer.task_name} />
            </div>

            <div className={`order-6 col-span-4 md:col-span-5 xl:order-2 xl:col-span-1 ${!timer.description ? 'hidden sm:block' : 'block'}`}>
                {timer.description}
            </div>

            <div className="order-2 col-span-1 md:col-span-1 lg:order-3">
                <TimerIntervals
                    initalIntervals={timer.intervals}
                    onDelete={onDelete}
                />
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
                <TimerActions timer={timer} onEdit={onEdit} onDelete={onDelete} />
            </div>
        </div >
    );
}