import { useState, useEffect } from 'react';
import type { TimerInterval } from '@/types';
import { Trash2, Check } from 'lucide-react';
import { getCookie } from "@/utils/cookie";
import { DatePicker } from 'rsuite';
import 'rsuite/DatePicker/styles/index.css';
import "../../../css/rsuite-overrides.css";

type TimerIntervalsProps = {
    initalIntervals: TimerInterval[],
    onDelete: (interval: TimerInterval) => void,
    onUpdate: (updatedInterval: TimerInterval) => void
}

export default function TimerIntervals({ initalIntervals, onDelete, onUpdate }: TimerIntervalsProps) {

    const [intervals, setIntervals] = useState<TimerInterval[]>(initalIntervals);
    const [editingValues, setEditingValues] = useState<Record<string, Date>>({});
    const [errors, setErrors] = useState<Record<string, string | undefined>>({});
    const [saving, setSaving] = useState<Record<string, boolean>>({});
    const [saved, setSaved] = useState<Record<string, boolean>>({});

    useEffect(() => {
        setIntervals(initalIntervals);
    }, [initalIntervals]);

    const handleChange = (interval: TimerInterval, field: 'start' | 'stop', value: Date | null) => {
        if (value === null) return;
        const key = `${interval.id}-${field}`;

        setEditingValues(prev => ({ ...prev, [key]: value }));
        setErrors(prev => ({ ...prev, [key]: undefined }));

        update(interval, field, value);
    }

    const update = async (interval: TimerInterval, field: 'start' | 'stop', value: Date) => {

        const key = `${interval.id}-${field}`;

        if (value === undefined || !interval[field] || value.getTime() === new Date(interval[field]).getTime()) {
            return;
        }

        setSaving(prev => ({ ...prev, [key]: true }));
        setErrors(prev => ({ ...prev, [key]: undefined }));

        try {
            const csrfToken = getCookie('XSRF-TOKEN');

            const response = await fetch(`/time-intervals/update-time/${interval.id}`, {
                method: 'PATCH',
                headers: {
                    'X-XSRF-TOKEN': csrfToken,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ [field]: value.toISOString() })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Save failed.');
            }

            onUpdate(data);
            setSaved(prev => ({ ...prev, [key]: true }));
            setTimeout(() => setSaved(prev => { const n = { ...prev }; delete n[key]; return n; }), 2000);

        } catch (error) {
            setErrors(prev => ({
                ...prev,
                [key]: error instanceof Error ? error.message : 'An error has occured.'
            }));

            setEditingValues(prev => {
                const newValues = { ...prev };
                delete newValues[key];
                return newValues;
            });
        } finally {
            setSaving(prev => ({ ...prev, [key]: false }));
        }
    };

    const timeDiff = (start: string, stop: string | null) => {
        if (!stop) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

        const diffMs = new Date(stop).getTime() - new Date(start).getTime();

        return {
            days: Math.floor(diffMs / 86400000),
            hours: Math.floor((diffMs % 86400000) / 3600000),
            minutes: Math.floor((diffMs % 3600000) / 60000),
            seconds: Math.floor((diffMs % 60000) / 1000),
        };
    }

    const formatDiff = (start: string, stop: string | null | undefined) => {

        if (!stop) return '0s';

        const { days, hours, minutes, seconds } = timeDiff(start, stop);

        const parts = [];
        if (days) parts.push(`${days}d`);
        if (hours) parts.push(`${hours}h`);
        if (minutes) parts.push(`${minutes}m`);
        if (seconds) parts.push(`${seconds}s`);

        return parts.length ? parts.join(" ") : "0s";
    }

    return (
        <div className="grid gap-2">
            {
                intervals.map(interval => (
                    <div key={interval['id']} className="flex flex-col gap-1">
                        <div className="flex items-center gap-5">
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <DatePicker
                                        format="MM.dd.yyyy HH:mm:ss"
                                        size="xs"
                                        name={`intervals[${interval.id}][start]`}
                                        value={editingValues[`${interval.id}-start`] ?? new Date(interval.start)}
                                        onChange={value => handleChange(interval, 'start', value)}
                                        cleanable={false}
                                        editable={false}
                                        disabled={saving[`${interval.id}-start`]}
                                    />
                                </div>
                                {saved[`${interval.id}-start`] && <Check size={12} className="text-green-500 shrink-0" />}
                                -
                                <div className="relative">
                                    <DatePicker
                                        format="MM.dd.yyyy HH:mm:ss"
                                        size="xs"
                                        name={`intervals[${interval.id}][stop]`}
                                        value={editingValues[`${interval.id}-stop`] ?? (interval.stop ? new Date(interval.stop) : null)}
                                        onChange={value => handleChange(interval, 'stop', value)}
                                        cleanable={false}
                                        editable={false}
                                        disabled={saving[`${interval.id}-stop`] || !interval.stop}
                                    />
                                </div>
                                {saved[`${interval.id}-stop`] && <Check size={12} className="text-green-500 shrink-0" />}
                                <span className="text-muted-foreground text-xs">
                                    {formatDiff(interval.start, interval.stop)}
                                </span>
                            </div>

                            <div className="flex gap-2">
                                <button className="cursor-pointer text-muted-foreground bg-muted p-1.5 rounded hover:text-foreground" onClick={() => onDelete(interval)}>
                                    <Trash2 size={10} />
                                </button>
                            </div>
                        </div>

                        {errors[`${interval.id}-start`] && (
                            <span className="text-xs text-red-500">{errors[`${interval.id}-start`]}</span>
                        )}
                        {errors[`${interval.id}-stop`] && (
                            <span className="text-xs text-red-500">{errors[`${interval.id}-stop`]}</span>
                        )}
                    </div>
                ))
            }
        </div >
    )
}