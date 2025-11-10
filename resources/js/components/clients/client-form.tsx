import { useEffect, useRef } from 'react';
import type { Client } from '@/types';
import { useForm } from '@inertiajs/react'
import InputError from '@/components/input-error';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import toast from 'react-hot-toast';
import FormActions from '../forms/form-actions';

export default function ClientForm({ client, onClose, visible }: { client: Client | null, onClose: () => void, visible: boolean }) {

    type FormData = {
        name: string,
        archived: boolean
    }

    const { data, setData, post, patch, reset, processing, errors } = useForm<FormData>({
        name: '',
        archived: false,
    });

    const nameInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!visible) return;

        setData({
            name: client?.name ?? '',
            archived: client?.archived ?? false,
        });

        setTimeout(() => nameInputRef.current?.focus(), 100);

    }, [client, visible]);

    function submit(e: React.FormEvent<HTMLFormElement>): void {
        e.preventDefault();

        const options = {
            onSuccess: () => {
                if (!client) reset();
                onClose();
                toast.success(client ? 'Client updated successfully!' : 'Client saved successfully!');
            },
            onError: (errors: any) => {
                console.error('Form errors:', errors);
                toast.error('There was an error saving the client.');
            }
        };

        if (client) {
            patch(route('clients.update', client.id), options);
        } else {
            post(route('clients.index'), options);
        }
    }

    return (
        <form onSubmit={submit} className="h-full flex flex-col flex-1">
            <div className="flex flex-col flex-1 p-5 gap-5">
                <div className="grid gap-2">
                    <Label htmlFor="name">Client name *</Label>
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

                {client && (
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="archived"
                            className="w-5 h-5"
                            checked={data.archived}
                            onCheckedChange={(checked) => setData('archived', Boolean(checked))}
                        />
                        <Label htmlFor="archived">Mark as archived</Label>
                        <InputError className="mt-2" message={errors.archived} />
                    </div>
                )}
            </div>

            <FormActions
                onClose={onClose}
                processing={processing}
            />
        </form>
    )
}