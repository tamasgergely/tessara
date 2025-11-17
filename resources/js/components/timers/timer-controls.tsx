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
                    <span className="hidden xl:inline">Stop</span>
                </Button>
            ) : (
                <Button onClick={onStart}>
                    <CirclePlay /> 
                    <span className="hidden xl:inline">Start</span>
                </Button>
            )}
        </div>
    );
}