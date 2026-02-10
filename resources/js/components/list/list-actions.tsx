import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { EllipsisVertical } from 'lucide-react';
import { useAppearance, prefersDark } from '@/hooks/use-appearance';

type RowActionsProps<T> = {
    entity: T,
    onEdit: (entity: T) => void,
    onDelete: (entity: T) => void,
    onArchive?: (entity: T) => void,
    onFileUpload?: (entity: T) => void,
}

export default function ListActions<T>({ onEdit, onDelete, onArchive, onFileUpload, entity }: RowActionsProps<T>) {
    const { appearance, updateAppearance } = useAppearance();

    const schemeIsDark = appearance === 'dark' || (appearance === 'system' && prefersDark());

    return (
        <div className="absolute flex items-center justify-center top-0 bottom-0 gap-3 right-2">
            <DropdownMenu >
                <DropdownMenuTrigger asChild>
                    <EllipsisVertical color={schemeIsDark ? '#fff' : '#1b1b1b'} size={28} className="cursor-pointer" />
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-32 rounded-lg" align="end" sideOffset={10}>
                    <DropdownMenuItem asChild>
                        <button className="block w-full cursor-pointer" onClick={() => onEdit(entity)}>
                            Edit
                        </button>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {onArchive &&
                        <>
                            <DropdownMenuItem asChild>
                                <button className="block w-full cursor-pointer" onClick={() => onArchive(entity)}>
                                    Archive
                                </button>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />
                        </>
                    }

                    {onFileUpload &&
                        <>
                            <DropdownMenuItem asChild>
                                <button className="block w-full cursor-pointer" onClick={() => onFileUpload(entity)}>
                                    Files
                                </button>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />
                        </>
                    }

                    <DropdownMenuItem asChild>
                        <button className="block w-full cursor-pointer text-red-500" onClick={() => onDelete(entity)}>
                            Delete
                        </button>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div >
    )
}