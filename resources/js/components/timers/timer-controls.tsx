import { Button } from "@/components/ui/button";
import { CircleStop, CirclePlay, LoaderCircle } from 'lucide-react';

type TimerControlsProps = {
    isRunning: boolean;
    pending: boolean;
    toggle: () => void;
};

export default function TimerControls({ isRunning, pending, toggle }: TimerControlsProps) {
    return (
        <div className="self-center">
            {isRunning ? (
                <Button onClick={toggle} disabled={pending} variant="destructive">
                    {pending ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : <CircleStop />}
                    <span className="hidden xl:inline">Stop</span>
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