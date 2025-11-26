import React from 'react';
import type { Timer } from '@/types';
import List from '@/components/list/list';
import ListHeader from '@/components/list/list-header';
import TimerProjectInfo from '@/components/timers/timer-project-info';
import { formatToLocalDate, formatToLocalTime } from '@/utils/date-formatter';

type GroupedTimers = {
    date: string;
    timers: Timer[];
}

type ReportListProps = {
    groupedTimers: GroupedTimers[],
}

export default function ReportList({ groupedTimers }: ReportListProps) {

    const totalSeconds = groupedTimers.reduce((acc, group) => {
        return acc + group.timers.reduce((acc2, timer) => {
            const { hours, minutes, seconds } = timer.elapsedTimeAsHMS;
            return acc2 + hours * 3600 + minutes * 60 + seconds;
        }, 0);
    }, 0);

    const totalHMS = {
        hours: Math.floor(totalSeconds / 3600),
        minutes: Math.floor((totalSeconds % 3600) / 60),
        seconds: totalSeconds % 60
    };

    return (
        <List>
            <ListHeader
                className="lg:grid-cols-[minmax(200px,300px)_minmax(250px,1fr)_minmax(130px,200px)_minmax(80px,150px)] 
                           sm:grid-cols-[minmax(200px,1fr)_150px_100px] 
                           lg:pr-0 pr-0">
                <div>
                    Task & Client & Project
                </div>
                <div className="hidden lg:block">
                    Task description
                </div>
                <div>
                    Intervals
                </div>
                <div>
                    Duration
                </div>
            </ListHeader>
            {
                groupedTimers.length > 0 ?
                    <>
                        {groupedTimers.map(groupedTimer => (
                            <React.Fragment key={groupedTimer.date}>
                                <div className="col-span-4 text-[10px] bg-primary mt-2 px-1 py-0.5 w-fit rounded-xs font-semibold">
                                    {formatToLocalDate(groupedTimer.date)}
                                </div>

                                {groupedTimer.timers.map(timer => (
                                    <div className="lg:grid-cols-[minmax(200px,300px)_minmax(250px,1fr)_minmax(130px,200px)_minmax(80px,150px)] 
                                                    sm:grid-cols-[minmax(200px,1fr)_150px_100px]
                                                    grid grid-cols-4
                                                    py-3 border-b border-border last:border-none gap-2 md:gap-x-5 2xl:gap-x-10"
                                        key={timer.id}>

                                        <div className="col-span-4 order-1 sm:col-span-1">
                                            <TimerProjectInfo
                                                projectName={timer.project_name}
                                                clientName={timer.client_name}
                                                taskName={timer.task_name}
                                            />
                                        </div>

                                        <div className="order-4 col-span-4 sm:col-span-3 lg:order-2 lg:col-span-1">
                                            {timer.description}
                                        </div>

                                        <div className="order-2 col-span-2 sm:col-span-1 lg:order-3">
                                            {timer.intervals.map(interval => (
                                                <div key={interval.id}>
                                                    {`${formatToLocalTime(interval.start)} - ${formatToLocalTime(interval.stop)}`}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="text-base self-center text-primary text-right order-3 col-span-2 sm:col-span-1 sm:text-left md:text-xl lg:order-4">
                                            <span className="sm:hidden">Total: </span>
                                            <span>{String(timer.elapsedTimeAsHMS.hours).padStart(2, '0')}</span>:
                                            <span>{String(timer.elapsedTimeAsHMS.minutes).padStart(2, '0')}</span>:
                                            <span>{String(timer.elapsedTimeAsHMS.seconds).padStart(2, '0')}</span>
                                        </div>
                                    </div>
                                ))}
                            </React.Fragment>
                        ))}
                        <div className="py-3 pr-5 col-span-4 text-base  text-right text-primary sm:text-xl">
                            Total: {String(totalHMS.hours).padStart(2, '0')}:
                            {String(totalHMS.minutes).padStart(2, '0')}:
                            {String(totalHMS.seconds).padStart(2, '0')}
                        </div>

                    </>
                    :
                    <div className="pt-3">
                        No tasks found.
                    </div>
            }
        </List>
    );
}