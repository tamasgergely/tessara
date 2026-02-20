import type { Option, User } from '@/types';
import SelectWrapper from '@/components/select-wrapper';
import { router, usePage } from '@inertiajs/react'

export default function PostsPerPage({ type }: { type: string }) {

    const { auth } = usePage<{ auth: { user: User } }>().props;

    const initialLimit = auth.user.preferences?.pagination?.[type] ?? 20;

    const perPageOptions: Option[] = [
        { value: '10', label: '10' },
        { value: '20', label: '20' },
        { value: '50', label: '50' },
        { value: '100', label: '100' },
    ];

    const handleLimitChange = (option: Option | null) => {
        const limit = option?.value ?? '20';

        router.patch(route('settings.preferences.update'), {
            [`pagination_${type}`]: parseInt(limit)

        }, {
            preserveState: false,
            preserveScroll: false,
        });
    }

    return (
        <SelectWrapper
            isClearable={false}
            options={perPageOptions}
            value={perPageOptions.find(opt => parseInt(opt.value) === initialLimit) ?? null}
            onChange={handleLimitChange}
            getOptionLabel={c => c.label}
            getOptionValue={c => c.value}
        />
    );
}