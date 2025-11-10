type TimerDurationProps = {
    hours: number,
    minutes: number,
    seconds: number
}

export default function TimerDuration({ hours, minutes, seconds }: TimerDurationProps) {
    return (
        <div className="text-sm self-center sm:text-xl">
            <span>{String(hours).padStart(2, '0')}</span>:
            <span>{String(minutes).padStart(2, '0')}</span>:
            <span>{String(seconds).padStart(2, '0')}</span>
        </div>

    );
}