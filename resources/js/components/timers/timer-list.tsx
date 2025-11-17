import type { Timer, TimerInterval } from "@/types";
import TimerRow from '@/components/timers/timer-row';
import ListHeader from '@/components/list/list-header';
import List from '@/components/list/list';

type TimerListProps = {
    timers: Timer[],
    onEdit: (timer: Timer) => void,
    onDelete: (item: Timer | TimerInterval) => void
}

export default function TimerList({ timers, onEdit, onDelete }: TimerListProps) {
    return (
        <List>
            <ListHeader
                className="xl:grid xl:grid-cols-[minmax(200px,350px)_minmax(250px,1fr)_200px_80px_80px_30px]
                           sm:hidden
                           lg:pr-0 pr-0">
                <div>
                    Task & Project & Client
                </div>
                <div>
                    Task description
                </div>
                <div>
                    Intervals
                </div>
                <div>
                    Duration
                </div>
                <div></div>
            </ListHeader>
            {
                timers.length > 0 ?
                    timers.map(timer => (
                        <TimerRow key={timer.id} initialTimer={timer} onEdit={onEdit} onDelete={onDelete} />
                    ))
                    : <div className="py-3">
                        No timers found.
                    </div>
            }
        </List>
    )
}