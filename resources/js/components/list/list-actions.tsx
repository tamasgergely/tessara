import { ReactNode } from 'react';

export interface RowAction {
    key: string;
    icon: ReactNode;
    onClick: () => void;
}

interface RowActionsProps {
    actions: RowAction[];
}

export default function ListActions({ actions }: RowActionsProps) {
    return (
        <div className="absolute flex items-center top-0 bottom-0 gap-3 right-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible">
            {actions.map(action => (
                <button
                    key={action.key}
                    className="cursor-pointer"
                    onClick={action.onClick}
                >
                    {action.icon}
                </button>
            ))}
        </div>
    )
}