import { useEffect, useMemo, useRef } from 'react';
import type { Client } from '@/types';
import { useForm, router, usePage } from '@inertiajs/react'
import SelectWrapper from '@/components/select-wrapper';
import InputError from '@/components/input-error';
import FilterFormWrapper from '../filter-form-wrapper';

type TaskFilterFormProps = {
    initialClients: Client[] | [],
}

export default function ProjectFilterForm({ initialClients }: TaskFilterFormProps) {
    type FormData = {
        client_id: number | null,
        search: string,
        state: string,
    }

    const queryParams = new URLSearchParams(window.location.search);

    const { data, setData } = useForm<FormData>({
        client_id: Number(queryParams.get('client_id')) || null,
        search: queryParams.get('search') || '',
        state: queryParams.get('state') || 'active',
    });

    const { errors } = usePage<{ errors: Record<string, any> }>().props;

    const isFirstRender = useRef(true);

    const selectedClient = useMemo(
        () => initialClients.find(client => client.id === data?.client_id) ?? null,
        [initialClients, data.client_id]
    )

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        submit();
    }, [data.client_id, data.search, data.state])

    const handleClientChange = (client: Client | null) => {
        setData(prev => ({
            ...prev,
            client_id: client?.id ?? null,
            project_id: null,
        }))
    }

    const submit = (): void => {
        router.get(route('projects.index'), {
            client_id: data.client_id,
            search: data.search,
            state: data.state,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    }

    return (
        <FilterFormWrapper
            data={data}
            setData={setData}
            errors={errors}
            type="projects"
            className="md:grid-cols-3 xl:grid-cols-[minmax(100px,200px)_minmax(200px,200px)_minmax(200px,250px)]"
        >
            <div className="grid gap-2">
                <SelectWrapper
                    options={initialClients}
                    value={selectedClient}
                    onChange={handleClientChange}
                    getOptionLabel={c => c.name}
                    getOptionValue={c => String(c.id)}
                    placeholder="Select client"
                />
                <InputError message={errors?.filterFormError?.client_id} />
            </div>
        </FilterFormWrapper>
    )
}