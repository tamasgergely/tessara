import type { Timer } from '@/types';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { EllipsisVertical } from 'lucide-react';
import { Appearance, useAppearance } from '@/hooks/use-appearance';

type TimerActionsProp = {
    timer: Timer,
    onEdit: (timer: Timer) => void,
    onDelete: (timer: Timer) => void
}

export default function TimerActions({ timer, onEdit, onDelete }: TimerActionsProp) {

    const { appearance, updateAppearance } = useAppearance();

    return (
        <div className="flex items-center justify-center">
            <DropdownMenu >
                <DropdownMenuTrigger asChild>
                    <EllipsisVertical color={appearance === 'dark' ? '#fff' : '#1b1b1b'} size={28} className="cursor-pointer" />
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-32 rounded-lg" align="end" sideOffset={10}>
                    <DropdownMenuItem asChild>
                        <button className="block w-full cursor-pointer" onClick={() => onEdit(timer)}>
                            Edit
                        </button>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem asChild>
                        <button className="block w-full cursor-pointer" onClick={() => onDelete(timer)}>
                            Delete
                        </button>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}