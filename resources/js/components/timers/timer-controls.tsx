import { Button } from "@/components/ui/button";
import { CircleStop, CirclePlay, CalendarArrowUp, LoaderCircle } from 'lucide-react';

type TimerControlsProps = {
    isRunning: boolean;
    isPastDay: boolean;
    pending: boolean;
    toggle: () => void;
    continueTimer: () => void;
};

export default function TimerControls({ isRunning, isPastDay, pending, toggle, continueTimer }: TimerControlsProps) {
    return (
        <div className="self-center">
            {isRunning ? (
                <Button onClick={toggle} disabled={pending} variant="destructive">
                    {pending ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : <CircleStop />}
                    <span className="hidden xl:inline">Stop</span>
                </Button>
            ) : isPastDay ? (
                <Button
                    onClick={continueTimer}
                    disabled={pending}
                    variant="secondary"
                    title="Continue as a new entry today"
                    aria-label="Continue today"
                >
                    {pending ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : <CalendarArrowUp />}
                    <span className="hidden xl:inline">Continue</span>
                </Button>
            ) : (
                <Button onClick={toggle} disabled={pending}>
                    {pending ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : <CirclePlay />}
                    <span className="hidden xl:inline">Start</span>
                </Button>
            )}
        </div>
    );
}