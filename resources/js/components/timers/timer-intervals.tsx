import { useState, useEffect } from 'react';
import type { TimerInterval } from '@/types';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';
import { formatToLocalTime } from '@/utils/date-formatter';

export default function TimerIntervals({ initalIntervals, onDelete }: { initalIntervals: TimerInterval[], onDelete: (interval: TimerInterval) => void }) {

    const [intervals, setIntervals] = useState<TimerInterval[]>(initalIntervals);
    const [editingValues, setEditingValues] = useState<Record<string, string>>({});
    const [errors, setErrors] = useState<Record<string, string | undefined>>({});
    const [saving, setSaving] = useState<Record<string, boolean>>({});

    useEffect(() => {
        setIntervals(initalIntervals);
    }, [initalIntervals]);

    const handleChange = (intervalId: number, field: 'start' | 'stop', value: string) => {
        const key = `${intervalId}-${field}`;
        setEditingValues(prev => ({ ...prev, [key]: value }));

        setErrors(prev => ({ ...prev, [key]: undefined }));
    }

    const handleBlur = async (interval: TimerInterval, field: 'start' | 'stop') => {
        const key = `${interval.id}-${field}`;
        const newValue = editingValues[key];


        if (newValue === undefined || newValue === formatToLocalTime(interval[field])) {
            return;
        }

        setSaving(prev => ({ ...prev, [key]: true }));
        setErrors(prev => ({ ...prev, [key]: undefined }));

        try {
            const csrfToken = (document.querySelector('meta[name=csrf-token]') as HTMLMetaElement)?.content ?? '';

            const [hours, minutes] = newValue.split(':');
            const localDate = new Date();
            localDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
            const utcString = localDate.toISOString();

            const response = await fetch(`/time-intervals/update-time/${interval.id}`, {
                method: 'PATCH',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ [field]: utcString })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Mentés sikertelen');
            }

            const updatedInterval = await response.json();

            setIntervals(prev =>
                prev.map(i => i.id === interval.id ? updatedInterval : i)
            );

            setEditingValues(prev => {
                const newValues = { ...prev };
                delete newValues[key];
                return newValues;
            });

        } catch (error) {
            setErrors(prev => ({
                ...prev,
                [key]: error instanceof Error ? error.message : 'Hiba történt'
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

    return (
        <div className="grid gap-2">
            {
                intervals.map(interval => (
                    <div key={interval['id']} className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Input
                                    type="time"
                                    name={`intervals[${interval.id}][start]`}
                                    className="text-xs w-17 sm:text-sm sm:w-18 h-8"
                                    value={editingValues[`${interval.id}-start`] ?? formatToLocalTime(interval.start)}
                                    onChange={e => handleChange(interval.id, 'start', e.target.value)}
                                    onBlur={() => handleBlur(interval, 'start')}
                                    disabled={saving[`${interval.id}-start`]}
                                />
                            </div>
                            -
                            <div className="relative">
                                <Input
                                    type="time"
                                    className="text-xs w-17 sm:text-sm sm:w-18 h-8"
                                    name={`intervals[${interval.id}][stop]`}
                                    value={editingValues[`${interval.id}-stop`] ?? formatToLocalTime(interval.stop)}
                                    onChange={e => handleChange(interval.id, 'stop', e.target.value)}
                                    onBlur={() => handleBlur(interval, 'stop')}
                                    disabled={saving[`${interval.id}-stop`]}
                                />
                            </div>

                            <button className="cursor-pointer" onClick={() => onDelete(interval)}>
                                <Trash2 size={14} />
                            </button>
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