import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { DatePicker } from 'rsuite';
import 'rsuite/DatePicker/styles/index.css';
import '../../../css/rsuite-overrides.css';
import { Button } from '@/components/ui/button';
import { parseDay } from '@/utils/day';
import { formatDayLong } from '@/utils/date-formatter';

type DayNavigatorProps = {
    date: string;
    today: string;
    onPrevious: () => void;
    onNext: () => void;
    onToday: () => void;
    onSelect: (date: Date) => void;
};

// rsuite hands its caret icon fill="currentColor", which floods an outline icon.
function CalendarCaret(props: React.ComponentProps<typeof CalendarDays>) {
    return <CalendarDays {...props} fill="none" />;
}

export default function DayNavigator({ date, today, onPrevious, onNext, onToday, onSelect }: DayNavigatorProps) {
    const isToday = date === today;
    const shown = parseDay(date);
    const lastSelectable = parseDay(today);

    return (
        <div className="flex flex-col items-center gap-2 bg-list rounded-lg p-2 md:grid md:grid-cols-[1fr_auto_1fr] md:gap-4 md:px-5">
            <div className="flex items-center gap-1 md:col-start-2">
                <Button variant="ghost" size="icon" onClick={onPrevious} aria-label="Previous day">
                    <ChevronLeft />
                </Button>

                <DatePicker
                    value={shown}
                    onChange={value => value && onSelect(value)}
                    oneTap
                    isoWeek
                    cleanable={false}
                    editable={false}
                    appearance="subtle"
                    placement="bottomStart"
                    caretAs={CalendarCaret}
                    shouldDisableDate={day => day > lastSelectable}
                    renderValue={() => formatDayLong(date)}
                    aria-label="Choose a day"
                    className="day-navigator-picker"
                />

                <Button variant="ghost" size="icon" onClick={onNext} disabled={isToday} aria-label="Next day">
                    <ChevronRight />
                </Button>
            </div>

            <div className="md:justify-self-start">
                {isToday ? (
                    <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                        <span className="size-2 rounded-full bg-primary" aria-hidden="true" />
                        Today
                    </span>
                ) : (
                    <Button variant="secondary" size="sm" onClick={onToday}>
                        Back to today
                    </Button>
                )}
            </div>
        </div>
    );
}
