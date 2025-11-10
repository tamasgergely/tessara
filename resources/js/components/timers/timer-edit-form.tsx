import { useEffect, useRef } from 'react';
import type { Project, Timer, Client } from '@/types';
import { useForm } from '@inertiajs/react'
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import toast from 'react-hot-toast';
import SelectWrapper from '../select-wrapper';
import { useTaskForm } from '@/hooks/use-task-form';
import FormActions from '../forms/form-actions';


type TimerEditFormProps = {
    timer: Timer,
    projects: Project[],
    clients: Client[],
    onClose: () => void,
    visible: boolean
}

export default function TimerEditForm({ timer, projects, clients, onClose, visible }: TimerEditFormProps) {

    type FormData = {
        timer_id: number,
        task_name: string,
        project_id: number | null,
        client_id: number | null,
        description: string
    }

    const { data, setData, patch, processing, errors } = useForm<FormData>({
        timer_id: timer.id,
        task_name: '',
        project_id: null,
        client_id: null,
        description: '',
    });

    const {
        selectedProject,
        selectedClient,
        isClientSelectDisabled,
        filteredProjects,
        handleProjectChange,
        handleClientChange,
        setSelectedProject,
        setSelectedClient,
        setFilteredProjects,
    } = useTaskForm({
        projects,
        setData,
    });

    const taskInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!visible) return;

        setData({
            timer_id: timer.id,
            task_name: timer.task_name,
            project_id: timer?.project_id ?? null,
            client_id: timer?.client_id ?? null,
            description: timer?.description ?? ''
        });

        const selectedProject = timer?.project_id
            ? projects.find(project => project.id === timer.project_id) ?? null
            : null;

        const selectedClient = timer?.client_id
            ? clients.find(client => client.id === timer.client_id) ?? null
            : null;

        setFilteredProjects(timer.client_id ? projects.filter(project => project.client?.id === timer.client_id) : projects);

        setSelectedProject(selectedProject);
        setSelectedClient(selectedClient);

        setTimeout(() => {
            taskInputRef.current?.focus()
        }, 100)

    }, [timer, visible]);


    function submit(e: React.FormEvent<HTMLFormElement>): void {
        e.preventDefault();

        const options = {
            onSuccess: () => {
                onClose();
                toast.success('Time entry saved successfully!');

            },
            onError: (errors: any) => {
                console.error('Form errors:', errors);
                toast.error('There was an error saving the timer.');
            }
        };

        patch(route('timers.update', timer.id), options);
    }

    return (
        <form onSubmit={submit} className="h-full flex flex-col flex-1">
            <div className="flex flex-col flex-1 p-5 gap-5">
                <div className="grid gap-2">
                    <Label>Task</Label>
                    <Input
                        id="name"
                        className="mt-1 block w-full"
                        value={data.task_name}
                        required
                        onChange={(e) => setData('task_name', e.target.value)}
                        ref={taskInputRef}
                        placeholder="Full name"
                    />
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
                saveLabel='Update'
            />
        </form>
    )
}