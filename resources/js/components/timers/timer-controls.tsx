import { Button } from "@/components/ui/button";
import { CircleStop, CirclePlay } from 'lucide-react';

type TimerControlsProps = {
    isRunning: boolean;
    onStart: () => void
    onStop: () => void;
};

export default function TimerControls({ isRunning, onStart, onStop }: TimerControlsProps) {
    return (
        <div className="self-center">
            {isRunning ? (
                <Button onClick={onStop} variant="destructive">
                    <CircleStop /> 
                    <span className="hidden md:inline">Stop</span>
                </Button>
            ) : (
                <Button onClick={onStart}>
                    <CirclePlay /> 
                    <span className="hidden md:inline">Start</span>
                </Button>
            )}
        </div>
    );
}