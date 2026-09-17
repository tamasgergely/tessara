import { apiFetch } from '@/utils/api';

export function updateFile(fileId: number, field: 'title' | 'description', value: string): Promise<void> {
    return apiFetch(route('files.update', fileId), {
        method: 'PATCH',
        body: { [field]: value },
    });
}
