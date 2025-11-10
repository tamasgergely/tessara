import React from 'react';
import type { Task } from '@/types';
import { NotepadText, X, Check, Trash2, Pencil, StickyNote, User } from 'lucide-react';
import List from '@/components/list/list';
import ListHeader from '@/components/list/list-header';
import ListRow from '@/components/list/list-row';
import ListActions from '@/components/list/list-actions';

type TaskListProps = {
    tasks: Task[],
    onEdit: (task: Task) => void,
    onDelete: (task: Task) => void
}

function TaskList({ tasks, onEdit, onDelete }: TaskListProps) {

    return (
        <List>
            <ListHeader className="md:grid hidden md:grid-cols-[minmax(100px,400px)_minmax(100px,400px)_minmax(100px,400px)_minmax(200px,600px)_1fr_60px]">
                <div>
                    Task
                </div>
                <div>
                    Project
                </div>
                <div>
                    Client
                </div>
                <div>
                    Description
                </div>
                <div></div>
                <div className="text-center">
                    Archived
                </div>
                <div></div>
            </ListHeader>
            {tasks?.length > 0 ?
                tasks.map(task => (
                    <ListRow className="grid md:grid-cols-[minmax(100px,400px)_minmax(100px,400px)_minmax(100px,400px)_minmax(200px,600px)_1fr_60px]" key={task.id}>
                        <div className="flex gap-1 items-center">
                            <StickyNote height={16} />
                            {task.name}
                        </div>
                        <div className="flex gap-1 items-center">
                            {task.project && (
                                <>
                                    <NotepadText height={16} />
                                    {task.project?.name}
                                </>
                            )}
                        </div>
                        <div className="flex gap-1 items-center">
                            {task.client && (
                                <>
                                    <User height={16} />
                                    {task.client?.name}
                                </>
                            )}
                        </div>
                        <div>
                            {task.description}
                        </div>
                        <div></div>
                        <div className="md:flex gap-1 items-center justify-center hidden">
                            <span aria-label={task.archived ? "Archived" : "Active"}>
                                {task.archived ? <Check /> : <X />}
                            </span>
                        </div>
                        <ListActions
                            actions={[
                                { key: 'edit', icon: <Pencil />, onClick: () => onEdit(task) },
                                { key: 'delete', icon: <Trash2 />, onClick: () => onDelete(task) },
                            ]}
                        />
                    </ListRow>
                ))

                : <div className="pt-3">
                    No tasks found.
                </div>
            }
        </List>
    )
}

export default React.memo(TaskList);