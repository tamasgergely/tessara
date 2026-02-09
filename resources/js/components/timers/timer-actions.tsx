import type { Timer } from '@/types';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { EllipsisVertical } from 'lucide-react';
import { useAppearance, prefersDark } from '@/hooks/use-appearance';

type TimerActionsProp = {
    timer: Timer,
    onEdit: (timer: Timer) => void,
    onDelete: (timer: Timer) => void
}

export default function íTimerActions({ timer, onEdit, onDelete }: TimerActionsProp) {

    const { appearance, updateAppearance } = useAppearance();

    const schemeIsDark = appearance === 'dark' || (appearance === 'system' && prefersDark());

    return (
        <div className="flex items-center justify-center">
            <DropdownMenu >
                <DropdownMenuTrigger asChild>
                    <EllipsisVertical color={schemeIsDark ? '#fff' : '#1b1b1b'} size={28} className="cursor-pointer" />
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-32 rounded-lg" align="end" sideOffset={10}>
                    <DropdownMenuItem asChild>
                        <button className="block w-full cursor-pointer" onClick={() => onEdit(timer)}>
                            Edit
                        </button>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem asChild>
                        <button className="block text-red-500 w-full cursor-pointer" onClick={() => onDelete(timer)}>
                            Delete
                        </button>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}