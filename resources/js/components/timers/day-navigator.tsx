import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { DatePicker } from 'rsuite';
import 'rsuite/DatePicker/styles/index.css';
import '../../../css/rsuite-overrides.css';
import { Button } from '@/components/ui/button';
import { parseDay } from '@/utils/day';

type DayNavigatorProps = {
    date: string;
    today: string;
    onPrevious: () => void;
    onNext: () => void;
    onToday: () => void;
    onSelect: (date: Date) => void;
};

const labelFormat = new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
});

export default function DayNavigator({ date, today, onPrevious, onNext, onToday, onSelect }: DayNavigatorProps) {
    const isToday = date === today;
    const shown = parseDay(date);
    const lastSelectable = parseDay(today);

    return (
        <div className="flex flex-wrap items-center gap-2 px-2 mb-5 lg:px-0">
            <div className="flex items-center gap-1">
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
                    caretAs={CalendarDays}
                    shouldDisableDate={day => day > lastSelectable}
                    renderValue={value => labelFormat.format(value)}
                    aria-label="Choose a day"
                />

                <Button variant="ghost" size="icon" onClick={onNext} disabled={isToday} aria-label="Next day">
                    <ChevronRight />
                </Button>
            </div>

            {isToday ? (
                <span className="text-sm text-muted-foreground">Today</span>
            ) : (
                <Button variant="outline" size="sm" onClick={onToday}>
                    Back to today
                </Button>
            )}
        </div>
    );
}
