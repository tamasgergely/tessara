import { ReactNode, useRef } from 'react';
import PostsPerPage from '@/components/posts-per-page';
import { cn } from '@/lib/utils';
import SelectWrapper from './select-wrapper';
import { Input } from './ui/input';
import InputError from './input-error';
import { debounce } from 'lodash-es';
import { Option } from '@/types';

type FilterFormWrapperProps = {
    children?: ReactNode;
    className?: string;
    data: { search: string, state: string };
    setData: (callback: (prev: any) => any) => void;
    errors: Record<string, any>;
    type: string;
}

export default function FilterFormWrapper({ children, className, data, setData, errors, type }: FilterFormWrapperProps) {
    const searchInputRef = useRef<HTMLInputElement>(null);

    const stateOptions: Option[] = [
        { value: 'active', label: 'Active' },
        { value: 'archived', label: 'Archived' },
        { value: 'all', label: 'All' },
    ];

    const handleSearch = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
        setData(prev => ({
            ...prev,
            search: e.target.value,
        }));
    }, 300);

    const handleStateChange = (state: Option | null) => {
        setData(prev => ({
            ...prev,
            state: state?.value ?? 'active',
        }));
    }

    return (
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className={cn(
                "grid gap-5 w-full sm:grid-cols-2",
                className
            )}>
                <div className="grid gap-2">
                    <SelectWrapper
                        options={stateOptions}
                        value={stateOptions.find(option => option.value === data.state) ?? null}
                        onChange={handleStateChange}
                        getOptionLabel={c => c.label}
                        getOptionValue={c => String(c.value)}
                    />
                    <InputError message={errors?.filterFormError?.state} />
                </div>
                {children}
                <div className="grid gap-2">
                    <Input
                        id="search"
                        className="block w-full"
                        defaultValue={data.search}
                        onChange={handleSearch}
                        ref={searchInputRef}
                        placeholder="Search ..."
                    />
                    <InputError className="mt-2" message={errors?.filterFormError?.search} />
                </div>
            </div>
            <div className="grid gap-2 justify-end shrink-0">
                <PostsPerPage type={type} />
            </div>
        </div>
    );
}