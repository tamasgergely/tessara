import { useEffect, useState, useRef } from 'react';
import type { Project, Timer, Option, Task, Client } from '@/types';
import { useForm } from '@inertiajs/react'
import InputError from '@/components/input-error';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import toast from 'react-hot-toast';
import SelectWrapper from '../select-wrapper';
import CreatableSelectWrapper from '../creatable-select-wrapper';
import { useTaskForm } from '@/hooks/use-task-form';
import FormActions from '../forms/form-actions';

type TimerCreateFormProps = {
    projects: Project[],
    tasks: Task[],
    clients: Client[],
    onClose: () => void,
    visible: boolean
}

export default function TimerCreateForm({ projects, tasks, clients, onClose, visible }: TimerCreateFormProps) {

    const [selectedTaskOption, setSelectedTaskOption] = useState<Option | null>(null);

    type FormData = {
        task_id: number | null,
        task_name: string,
        project_id: number | null,
        client_id: number | null,
        description: string
    }

    const { data, setData, post, processing, errors } = useForm<FormData>({
        task_id: null,
        task_name: '',
        project_id: null,
        client_id: null,
        description: '',
    });

    const {
        selectedProject,
        selectedClient,
        isProjectSelectDisabled,
        isClientSelectDisabled,
        filteredProjects,
        handleProjectChange,
        handleClientChange,
        resetForm,
        resetSelects,
        enableSelects,
        applyTaskContext
    } = useTaskForm({
        projects,
        setData,
        initialProjectSelectDisabled: true,
        initialClientSelectDisabled: true
    });

    const taskSelectRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!visible) return;
        setTimeout(() => { taskSelectRef.current?.focus() }, 100)
    }, [visible]);

    function submit(e: React.FormEvent<HTMLFormElement>): void {
        e.preventDefault();

        const options = {
            onSuccess: () => {
                onClose();

                setSelectedTaskOption(null);
                setData('description', '');
                resetForm();

                toast.success('Time entry saved successfully!');

            },
            onError: (errors: any) => {
                console.error('Form errors:', errors);
                toast.error('There was an error saving the timer.');
            }
        };

        post(route('timers.index'), options);
    }

    const handleTaskChange = (option: Option | null) => {
        setSelectedTaskOption(option);

        // Task törölve → minden mező resetelése, selectek disabled
        if (!option) {
            setData('task_id', null);
            setData('task_name', '');
            setData('project_id', null);
            setData('client_id', null);

            resetForm();
            return;
        }

        setData('task_name', option.label);

        if (option.__isNew__) {
            setData('task_id', null);
            setData('project_id', null);
            setData('client_id', null);

            resetSelects();
            enableSelects();

            return;
        }

        const taskId = parseInt(option.value);
        setData('task_id', isNaN(taskId) ? null : taskId);

        const selectedTask = tasks.find(task => task.id === taskId);

        applyTaskContext(selectedTask)
    };

    return (
        <form onSubmit={submit} className="h-full flex flex-col flex-1">
            <div className="flex flex-col flex-1 p-5 gap-5">
                <div className="grid gap-2">
                    <Label>Task</Label>
                    <CreatableSelectWrapper<Task>
                        options={tasks ?? []}
                        value={selectedTaskOption}
                        onChange={handleTaskChange}
                        getOptionLabel={(task) => task.name}
                        getOptionValue={(task) => String(task.id)}
                        getOptionSubLabel={(task) => task.client ? task.client.name : ''}
                        ref={taskSelectRef}
                    />
                    <InputError message={errors.task_id} />
                </div>

                <div className="grid gap-2">
                    <Label>Clients</Label>
                    <SelectWrapper
                        options={clients}
                        value={selectedClient}
                        onChange={handleClientChange}
                        getOptionLabel={c => c.name}
                        getOptionValue={c => String(c.id)}
                        isDisabled={isClientSelectDisabled}
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
                        isDisabled={isProjectSelectDisabled}
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