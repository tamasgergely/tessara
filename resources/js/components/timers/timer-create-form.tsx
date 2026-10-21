import { useEffect, useState, useRef } from 'react';
import type { Project, Task, Client } from '@/types';
import { useForm } from '@inertiajs/react'
import InputError from '@/components/input-error';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import toast from 'react-hot-toast';
import SelectWrapper from '../select-wrapper';
import { useTaskForm } from '@/hooks/use-task-form';
import FormActions from '../forms/form-actions';
import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { DatePicker } from 'rsuite';
import 'rsuite/DatePicker/styles/index.css';
import '../../../css/rsuite-overrides.css';
import { parseDay, toDayString } from '@/utils/day';
import { toHMS } from '@/utils/elapsed';

type TimerCreateFormProps = {
    projects: Project[],
    tasks: Task[],
    clients: Client[],
    onClose: () => void,
    visible: boolean,
    date: string,
    today: string
}

export default function TimerCreateForm({ projects, tasks, clients, onClose, visible, date, today }: TimerCreateFormProps) {
    const MIN_QUERY_LENGTH = 2;
    const MAX_SUGGESTIONS = 8;
    const MINUTES_PER_DAY = 1440;

    type FormData = {
        task_id: number | null,
        task_name: string,
        project_id: number | null,
        client_id: number | null,
        description: string,
        date: string,
        from: string,
        to: string
    }

    const [open, setOpen] = useState<boolean>(false);
    const [isLogging, setIsLogging] = useState<boolean>(false);
    const [highlightIndex, setHighlightIndex] = useState(-1);

    const { data, setData, post, processing, errors, reset } = useForm<FormData>({
        task_id: null,
        task_name: '',
        project_id: null,
        client_id: null,
        description: '',
        date: date,
        from: '',
        to: ''
    });

    // The interval check runs in TimeIntervalService and reports under `time`, which is not a form field.
    const allErrors: Partial<Record<string, string>> = errors;

    const {
        selectedProject,
        selectedClient,
        filteredProjects,
        handleProjectChange,
        handleClientChange,
        resetSelects,
        applyTaskContext
    } = useTaskForm({
        projects,
        setData
    });

    const isTimeFilled = !!(data.from && data.to);
    const endsNextDay = isTimeFilled && data.to < data.from;

    const duration = getDuration();

    function handleDateChange(value: Date | null): void {
        if (!value) return;
        setData('date', toDayString(value));
    }

    function toMinutes(time: string): number {
        const [hours, minutes] = time.split(':');

        return parseInt(hours) * 60 + parseInt(minutes);
    }

    function getDuration(): string | null {
        if (!isTimeFilled) return null;

        const timeDifference = toMinutes(data.to) - toMinutes(data.from);

        if (timeDifference === 0) return null;

        const { hours, minutes } = toHMS((timeDifference + (endsNextDay ? MINUTES_PER_DAY : 0)) * 60);

        return `${hours}h ${minutes}m`;
    }

    const taskInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!visible) return;
        setIsLogging(date !== today);
        setData('date', date);
        setTimeout(() => { taskInputRef.current?.focus() }, 100)
    }, [visible, date]);

    function submit(e: React.FormEvent<HTMLFormElement>): void {
        e.preventDefault();

        const options = {
            onSuccess: () => {
                onClose();

                reset();
                resetSelects();

                toast.success(isLogging ? 'Time entry saved successfully!' : 'Time entry started successfully!');
            },
            onError: (errors: any) => {
                console.error('Form errors:', errors);
                toast.error('There was an error saving the timer.');
            }
        };

        post(route(isLogging ? 'timers.record' : 'timers.store'), options);
    }

    const handleTaskNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setHighlightIndex(-1);
        setData('task_id', null);
        setData('task_name', event.target.value)
        setOpen(true);
    };

    const handleTaskSelect = (task: Task): void => {
        setHighlightIndex(-1);
        setData('task_id', task.id);
        setData('task_name', task.name);
        applyTaskContext(task);
        setOpen(false);
    };

    const handleTaskKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {

        if (suggestions.length === 0) return;

        if (event.key === 'ArrowDown') {
            event.preventDefault();
            setOpen(true);
            setHighlightIndex(index => Math.min(index + 1, suggestions.length - 1));
            return;
        }

        if (event.key === 'ArrowUp') {
            event.preventDefault();
            setHighlightIndex(index => Math.max(index - 1, -1));
            return;
        }

        if (event.key === 'Enter' && highlightIndex >= 0) {
            event.preventDefault();
            handleTaskSelect(suggestions[highlightIndex]);
        }
    }

    const suggestions = matchingTasks(tasks, data.task_name);

    function matchingTasks(tasks: Task[], text: string): Task[] {

        const query = text.trim().toLowerCase();

        if (query.length < MIN_QUERY_LENGTH) return [];

        return tasks.filter(task => task.name.toLowerCase().includes(query)).slice(0, MAX_SUGGESTIONS);
    }

    return (
        <form onSubmit={submit} className="h-full flex flex-col flex-1">
            <div className="flex flex-col flex-1 p-5 gap-5">
                <div className="grid gap-2">
                    <Label>Task</Label>

                    <Popover open={open && suggestions.length > 0} onOpenChange={setOpen}>
                        <PopoverAnchor asChild>
                            <Input
                                id="task"
                                className="mt-1 block w-full"
                                value={data.task_name}
                                required
                                onChange={(e) => handleTaskNameChange(e)}
                                onKeyDown={(e) => handleTaskKeyDown(e)}
                                autoComplete="off"
                                ref={taskInputRef}
                                placeholder="Task"
                            />
                        </PopoverAnchor>

                        <PopoverContent
                            align="start"
                            className="w-(--radix-popover-trigger-width) p-1"
                            onOpenAutoFocus={(e) => e.preventDefault()}
                            onEscapeKeyDown={(e) => {
                                e.stopPropagation();
                                setHighlightIndex(-1);
                            }}
                        >
                            {suggestions.map((task, index) => (
                                <button
                                    key={task.id}
                                    type="button"
                                    className={cn(
                                        "flex w-full flex-col items-start gap-0.5 rounded-sm px-2 py-1.5 text-left text-sm",
                                        "hover:bg-accent hover:text-accent-foreground",
                                        index === highlightIndex && "bg-accent text-accent-foreground"
                                    )}
                                    onClick={() => handleTaskSelect(task)}
                                    onMouseEnter={() => setHighlightIndex(index)}
                                >
                                    <span>{task.name}</span>
                                    {task.client && (
                                        <span className="text-xs text-muted-foreground">{task.client.name}</span>
                                    )}
                                </button>
                            ))}

                        </PopoverContent>
                    </Popover>

                    <InputError message={errors.task_name} />
                </div>

                <div className="grid gap-2">
                    <Label>Clients</Label>
                    <SelectWrapper
                        options={clients}
                        value={selectedClient}
                        onChange={handleClientChange}
                        getOptionLabel={c => c.name}
                        getOptionValue={c => String(c.id)}
                    />
                    <InputError message={errors.client_id} />
                </div>

                <div className="grid gap-2">
                    <Label>Project</Label>
                    <SelectWrapper
                        options={filteredProjects}
                        value={selectedProject}
                        onChange={handleProjectChange}
                        getOptionLabel={c => c.name}
                        getOptionValue={c => String(c.id)}
                    />
                    <InputError message={errors.project_id} />
                </div>

                <div className="grid gap-2">
                    <div role="group" aria-label="Entry mode" className="grid grid-cols-2 gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800">
                        {[
                            { label: 'Start now', active: !isLogging, onClick: () => setIsLogging(false) },
                            { label: 'Log time', active: isLogging, onClick: () => setIsLogging(true) },
                        ].map(({ label, active, onClick }) => (
                            <button
                                key={label}
                                type="button"
                                aria-pressed={active}
                                onClick={onClick}
                                className={cn(
                                    'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                                    active
                                        ? 'bg-white text-foreground shadow-xs dark:bg-neutral-700'
                                        : 'text-neutral-500 hover:bg-neutral-200/60 hover:text-foreground dark:text-neutral-400 dark:hover:bg-neutral-700/60',
                                )}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    {!isLogging && (
                        <p className="text-sm text-muted-foreground">The timer starts today, when you save.</p>
                    )}
                </div>

                {isLogging && (
                    <div className="grid gap-5">
                        <div className="grid gap-2">
                            <Label>Date</Label>
                            <DatePicker
                                value={parseDay(data.date)}
                                onChange={handleDateChange}
                                oneTap
                                isoWeek
                                block
                                cleanable={false}
                                editable={false}
                                placement="bottomStart"
                                menuClassName="modal-picker-menu"
                                shouldDisableDate={day => day > parseDay(today)}
                                aria-label="Date"
                            />
                            <InputError message={errors.date} />
                        </div>

                        <div className="grid gap-2">
                            <div className="grid grid-cols-2 items-start gap-3">
                                <div className="grid gap-2">
                                    <Label htmlFor="from">From</Label>
                                    <Input
                                        id="from"
                                        type="time"
                                        value={data.from}
                                        onChange={e => setData('from', e.target.value)}
                                    />
                                    <InputError message={errors.from} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="to" className="flex items-center gap-2">
                                        To
                                        {endsNextDay && (
                                            <span className="rounded-full bg-primary/10 px-2 py-px text-xs leading-none font-medium text-primary">
                                                +1 day
                                            </span>
                                        )}
                                    </Label>
                                    <Input
                                        id="to"
                                        type="time"
                                        value={data.to}
                                        onChange={e => setData('to', e.target.value)}
                                    />
                                    <InputError message={errors.to} />
                                </div>
                            </div>

                            <InputError message={allErrors.time} />

                            {duration && (
                                <p className="text-sm text-muted-foreground">
                                    Duration: <span className="font-medium text-foreground tabular-nums">{duration}</span>
                                </p>
                            )}
                        </div>
                    </div>
                )}

                <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        className="min-h-48"
                        id="description"
                        value={data.description}
                        onChange={e => setData('description', e.target.value)}
                    />
                    <InputError message={errors.description} />
                </div>
            </div>

            <FormActions
                onClose={onClose}
                processing={processing}
            />
        </form>
    )
}