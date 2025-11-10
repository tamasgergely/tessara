import { useEffect, useState, useRef } from 'react';
import type { Project, Timer, Option, Task, Client } from '@/types';
import { useForm } from '@inertiajs/react'
import InputError from '@/components/input-error';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '../ui/button';
import { LoaderCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import SelectWrapper from '../select-wrapper';
import CreatableSelectWrapper from '../creatable-select-wrapper';

type TimerCreateFormProps = {
    timer: Timer | null,
    projects: Project[],
    tasks: Task[],
    clients: Client[],
    onClose: () => void,
    visible: boolean
}

export default function TimerCreateForm({ timer, projects, tasks, clients, onClose, visible }: TimerCreateFormProps) {

    type FormData = {
        task_id: number | null,
        task_name: string,
        project_id: number | null,
        client_id: number | null,
        description: string
    }

    const [selectedTaskOption, setSelectedTaskOption] = useState<Option | null>(null);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [isProjectSelectDisabled, setIsProjectSelectDisabled] = useState<boolean>(true);
    const [isClientSelectDisabled, setIsClientSelectDisabled] = useState<boolean>(true);
    const [filteredProjects, setFilteredProjects] = useState<Project[]>(projects);

    const { data, setData, post, patch, reset, processing, errors } = useForm<FormData>({
        task_id: null,
        task_name: '',
        project_id: null,
        client_id: null,
        description: '',
    });

    const taskSelectRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!visible) return;

        setData({
            task_id: timer?.task_id ?? null,
            task_name: timer?.task_name ?? '',
            project_id: timer?.project_id ?? null,
            client_id: timer?.client_id ?? null,
            description: timer?.description ?? ''
        });

        const selectedTaskOption = timer?.task_id
            ? {
                label: tasks?.find(task => task.id === timer.task_id)?.name ?? '',
                value: String(timer.task_id)
            }
            : null;

        const selectedProject = timer?.project_id
            ? projects.find(project => project.id === timer.project_id) ?? null
            : null;

        const selectedClient = timer?.client_id
            ? clients.find(client => client.id === timer.client_id) ?? null
            : null;


        setSelectedTaskOption(selectedTaskOption);
        setSelectedProject(selectedProject);
        setSelectedClient(selectedClient);

        setTimeout(() => {
            taskSelectRef.current?.focus()
        }, 100)

    }, [timer, visible]);

    function submit(e: React.FormEvent<HTMLFormElement>): void {
        e.preventDefault();

        const options = {
            onSuccess: () => {
                if (!timer) reset();
                onClose();
                toast.success(timer ? 'Time entry updated successfully!' : 'Time entry saved successfully!');

            },
            onError: (errors: any) => {
                console.error('Form errors:', errors);
                toast.error('There was an error saving the project.');
            }
        };

        if (timer) {
            patch(route('timers.update', timer.id), options);
        } else {
            post(route('timers.index'), options);
        }
    }

    const handleProjectChange = (project: Project | null) => {

        setSelectedProject(project);
        setData('project_id', project?.id ?? null);

        if (project?.client) {
            setSelectedClient(project.client);
            setData('client_id', project.client.id);
        } else {
            setSelectedClient(null);
            setData('client_id', null);
        }

        setIsClientSelectDisabled(true);
    };

    const handleClientChange = (client: Client | null) => {
        setSelectedClient(client);
        setData('client_id', client?.id ?? null);

        if (client) {
            const project = projects.filter(project => project?.client?.id === client?.id);
            setFilteredProjects(project);
        } else {
            setFilteredProjects(projects);
        }
    };

    const handleTaskChange = (option: Option | null) => {
        setSelectedTaskOption(option);

        // Task törölve/nincs választva
        if (!option) {
            setData('task_id', null);
            setData('task_name', '');
            setData('project_id', null);
            setData('client_id', null);
            setSelectedProject(null);
            setSelectedClient(null);
            setIsProjectSelectDisabled(true);
            setIsClientSelectDisabled(true);
            setFilteredProjects(projects);
            return;
        }

        setData('task_name', option.label);

        // Új task létrehozása
        if (option.__isNew__) {
            setData('task_id', null);
            setSelectedProject(null);
            setSelectedClient(null);
            setData('project_id', null);
            setData('client_id', null);
            setIsProjectSelectDisabled(false);
            setIsClientSelectDisabled(false);
            setFilteredProjects(projects);
            return;
        }

        // Létező task választása
        const taskId = parseInt(option.value);
        setData('task_id', isNaN(taskId) ? null : taskId);

        const selectedTask = tasks.find(task => task.id === taskId);

        if (selectedTask?.project) {
            // Projektspecifikus task → auto-fill és lock
            setSelectedProject(selectedTask.project);
            setSelectedClient(selectedTask.project.client);
            setData('project_id', selectedTask.project.id);
            setData('client_id', selectedTask.project?.client?.id ?? null);
            setFilteredProjects(projects.filter(project => project.client?.id === selectedTask.project?.client?.id));
            setIsProjectSelectDisabled(true);
            setIsClientSelectDisabled(true);

        } else {
            // Generikus task → user választhat project/client-et
            setSelectedProject(null);
            setSelectedClient(null);
            setData('project_id', null);
            setData('client_id', null);
            setFilteredProjects(projects);
            setIsProjectSelectDisabled(false);
            setIsClientSelectDisabled(false);
        }
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
                    />
                    <InputError message={errors.task_id} />
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

            <div className="flex justify-end gap-x-5 border-t border-gray-400 p-5">
                <Button type="button" variant="ghost" size="lg" onClick={onClose}>
                    Cancel
                </Button>
                <Button type="submit" size="lg" disabled={processing}>
                    {processing ? (
                        <>
                            <LoaderCircle className="h-4 w-4 animate-spin mr-2" aria-hidden="true" />
                            <span>Saving...</span>
                        </>
                    ) : (
                        'Save'
                    )}
                </Button>
            </div>
        </form>
    )
}