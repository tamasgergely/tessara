import { useEffect, useState, useRef } from 'react';
import type { Project, Client } from '@/types';
import { useForm } from '@inertiajs/react'
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import toast from 'react-hot-toast';
import SelectWrapper from '../select-wrapper';
import FormActions from '../forms/form-actions';

type ProjectFormProps = {
    project: Project | null,
    clients: Client[],
    onClose: () => void,
    visible: boolean
}

export default function ProjectForm({ project, clients, onClose, visible }: ProjectFormProps) {

    type FormData = {
        name: string,
        client_id: number | null,
        description: string
    }

    const [selectedClient, setSelectedClient] = useState<Client | null>(null);

    const { data, setData, post, patch, reset, processing, errors } = useForm<FormData>({
        name: '',
        client_id: null,
        description: ''
    });

    const nameInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!visible) return;

        setData({
            name: project?.name ?? '',
            client_id: project?.client?.id ?? null,
            description: project?.description ?? ''
        });

        const selectedClient = project?.client
            ? clients.find(client => client.id === project.client?.id) ?? null
            : null;

        setSelectedClient(selectedClient);

        setTimeout(() => nameInputRef.current?.focus(), 100);

    }, [project, visible, clients]);

    function submit(e: React.FormEvent<HTMLFormElement>): void {
        e.preventDefault();

        const options = {
            onSuccess: () => {
                if (!project) reset();
                onClose();
                toast.success(project ? 'Project updated successfully!' : 'Project saved successfully!');

            },
            onError: (errors: any) => {
                console.error('Form errors:', errors);
                toast.error('There was an error saving the project.');
            }
        };

        if (project) {
            patch(route('projects.update', project.id), options);
        } else {
            post(route('projects.index'), options);
        }
    }

    const handleClientChange = (client: Client | null) => {
        setSelectedClient(client);
        setData('client_id', client?.id ?? null);
    };



    return (
        <form onSubmit={submit} className="h-full flex flex-col flex-1">
            <div className="flex flex-col flex-1 p-5 gap-5">
                <div className="grid gap-2">
                    <Label htmlFor="name">Project name *</Label>
                    <Input
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        required
                        onChange={(e) => setData('name', e.target.value)}
                        autoComplete="name"
                        ref={nameInputRef}
                        placeholder="Full name"
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
                    />
                    <InputError message={errors.client_id} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="description">Project description</Label>
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