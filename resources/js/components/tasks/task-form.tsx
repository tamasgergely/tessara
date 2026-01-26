import { useEffect, useRef } from 'react';
import type { Task, Project, Client } from '@/types';
import { useForm } from '@inertiajs/react'
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import toast from 'react-hot-toast';
import SelectWrapper from '../select-wrapper';
import { useTaskForm } from '@/hooks/use-task-form';
import FormActions from '../forms/form-actions';

type TaskFormProps = {
    task: Task | null,
    projects: Project[],
    clients: Client[],
    onClose: () => void,
    visible: boolean
}

export default function TaskForm({ task, projects, clients, onClose, visible }: TaskFormProps) {

    type FormData = {
        id: number | null,
        name: string,
        project_id: number | null,
        client_id: number | null,
        description: string
    }

    const { data, setData, post, patch, reset, processing, errors } = useForm<FormData>({
        id: null,
        name: '',
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
        enableSelects,
        resetSelects,
        setSelectedProject,
        setSelectedClient,
    } = useTaskForm({
        projects,
        setData
    });

    const nameInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!visible) return;

        setData({
            id: task?.id ?? null,
            name: task?.name ?? '',
            project_id: task?.project?.id ?? null,
            client_id: task?.client?.id ?? null,
            description: task?.description ?? '',
        });

        const selectedProject = task?.project
            ? projects.find(project => project.id === task.project?.id) ?? null
            : null;

        const selectedClient = task?.client
            ? clients.find(client => client.id === task.client?.id) ?? null
            : null;

        setSelectedProject(selectedProject);
        setSelectedClient(selectedClient);

        setTimeout(() => nameInputRef.current?.focus(), 100);

    }, [task, visible, projects, clients]);

    function submit(e: React.FormEvent<HTMLFormElement>): void {
        e.preventDefault();

        const options = {
            onSuccess: () => {
                if (!task) {
                    enableSelects();
                    resetSelects();
                }
                onClose();
                toast.success(task ? 'Task updated successfully!' : 'Task saved successfully!');

            },
            onError: (errors: any) => {
                console.error('Form errors:', errors);
                toast.error('There was an error saving the project.');
            }
        };

        if (task) {
            patch(route('tasks.update', task.id), options);
        } else {
            post(route('tasks.index'), options);
        }
    }

    return (
        <form onSubmit={submit} className="h-full flex flex-col flex-1">
            <div className="flex flex-col flex-1 p-5 gap-5">
                <div className="grid gap-2">
                    <Label htmlFor="name">Task name *</Label>
                    <Input
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        required
                        onChange={(e) => setData('name', e.target.value)}
                        autoComplete="name"
                        ref={nameInputRef}
                        placeholder="Name"
                    />
                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div className="grid gap-2">
                    <Label>Client</Label>
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
                    <Label htmlFor="description">Task description</Label>
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