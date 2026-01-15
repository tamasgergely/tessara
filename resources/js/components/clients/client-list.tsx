import React, { useEffect } from 'react';
import type { Client } from '@/types';
import { User, Trash2, Pencil, Download, Upload } from 'lucide-react';
import List from '@/components/list/list';
import ListHeader from '@/components/list/list-header';
import ListRow from '@/components/list/list-row';
import ListActions from '@/components/list/list-actions';

type ClientListProps = {
    clients: Client[],
    onArchive: (client: Client) => void,
    onEdit: (client: Client) => void,
    onDelete: (client: Client) => void
}

export default function ClientList({ clients, onArchive, onEdit, onDelete }: ClientListProps) {
    return (
        <List>
            <ListHeader className="grid-cols-[minmax(150px,1fr)] grid">
                <div>
                    Client
                </div>
            </ListHeader>

            {clients?.length > 0 ?
                clients.map(client => (
                    <ListRow className="grid-cols-[minmax(150px,1fr)]" key={client.id}>
                        <div className={`flex gap-1 items-center ${client.archived ? 'text-archive' : 'text-primary'}`}>
                            <User height={16} />
                            {client.name}
                        </div>
                        <ListActions
                            actions={[
                                {
                                    key: 'archive',
                                    icon: client.archived
                                        ? <Upload className="w-4 h-4 sm:w-auto sm:h-auto" />
                                        : <Download className="w-4 h-4 sm:w-auto sm:h-auto" />,
                                    onClick: () => onArchive(client)
                                },
                                { key: 'edit', icon: <Pencil className="w-4 h-4 sm:w-auto sm:h-auto" />, onClick: () => onEdit(client) },
                                { key: 'delete', icon: <Trash2 className="w-4 h-4 sm:w-auto sm:h-auto" />, onClick: () => onDelete(client) },
                            ]}
                        />
                    </ListRow>
                ))
                : <div className="pt-3">
                    No clients found.
                </div>
            }
        </List>
    )
}