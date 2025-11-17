import React from 'react';
import type { Client } from '@/types';
import { User, X, Check, Trash2, Pencil } from 'lucide-react';
import List from '@/components/list/list';
import ListHeader from '@/components/list/list-header';
import ListRow from '@/components/list/list-row';
import ListActions from '@/components/list/list-actions';

type ClientListProps = {
    clients: Client[], 
    onEdit: (client: Client) => void, 
    onDelete: (client: Client) => void 
}

function ClientList({ clients, onEdit, onDelete }: ClientListProps) {

    return (
        <List>
            <ListHeader className="grid-cols-[minmax(150px,1fr)_60px] sm:grid-cols-[minmax(300px,600px)_100px] grid">
                <div>
                    Client
                </div>
                <div className="text-center">
                    Archived
                </div>
                <div></div>
            </ListHeader>

            {clients?.length > 0 ?
                clients.map(client => (
                    <ListRow className="grid-cols-[minmax(150px,1fr)_60px] sm:grid-cols-[minmax(300px,600px)_100px]" key={client.id}>
                        <div className="flex gap-1 items-center text-primary">
                            <User height={16} />
                            {client.name}
                        </div>
                        <div className="flex gap-1 items-center justify-center">
                            <span aria-label={client.archived ? "Archived" : "Active"}>
                                {client.archived ? <Check /> : <X />}
                            </span>
                        </div>
                        <ListActions
                            actions={[
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

export default React.memo(ClientList);