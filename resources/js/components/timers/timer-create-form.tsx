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

type TimerCreateFormProps = {
    projects: Project[],
    tasks: Task[],
    clients: Client[],
    onClose: () => void,
    visible: boolean
}

export default function TimerCreateForm({ projects, tasks, clients, onClose, visible }: TimerCreateFormProps) {
    const MIN_QUERY_LENGTH = 2;
    const MAX_SUGGESTIONS = 8;

    type FormData = {
        task_id: number | null,
        task_name: string,
        project_id: number | null,
        client_id: number | null,
        description: string
    }

    const [open, setOpen] = useState<boolean>(false);
    const [highlightIndex, setHighlightIndex] = useState(-1);

    const { data, setData, post, processing, errors, reset } = useForm<FormData>({
        task_id: null,
        task_name: '',
        project_id: null,
        client_id: null,
        description: '',
    });

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

    const taskInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!visible) return;
        setTimeout(() => { taskInputRef.current?.focus() }, 100)
    }, [visible]);

    function submit(e: React.FormEvent<HTMLFormElement>): void {
        e.preventDefault();

        const options = {
            onSuccess: () => {
                onClose();

                reset();
                resetSelects();

                toast.success('Time entry saved successfully!');

            },
            onError: (errors: any) => {
                console.error('Form errors:', errors);
                toast.error('There was an error saving the timer.');
            }
        };

        post(route('timers.index'), options);
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