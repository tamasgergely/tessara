import { useEffect, useRef } from 'react';
import { useForm, router, usePage } from '@inertiajs/react'
import FilterFormWrapper from '../filter-form-wrapper';


export default function ClientFilterForm() {
    type FormData = {
        search: string,
        state: string,
    }

    const queryParams = new URLSearchParams(window.location.search);

    const { data, setData } = useForm<FormData>({
        search: queryParams.get('search') || '',
        state: queryParams.get('state') || 'active',
    });

    const { errors } = usePage<{ errors: Record<string, any> }>().props;

    const isFirstRender = useRef(true);


    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        submit();
    }, [data.search, data.state])

    const submit = (): void => {
        router.get(route('clients.index'), {
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
            type="clients"
            className="md:grid-cols-4 xl:grid-cols-[minmax(100px,200px)_minmax(200px,200px)_minmax(200px,200px)_minmax(200px,250px)]"
        />
    )
}