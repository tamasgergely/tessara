import React from 'react';
import type { Task } from '@/types';
import { NotepadText, Trash2, Pencil, StickyNote, User, Download, Upload } from 'lucide-react';
import List from '@/components/list/list';
import ListHeader from '@/components/list/list-header';
import ListRow from '@/components/list/list-row';
import ListActions from '@/components/list/list-actions';

type TaskListProps = {
    tasks: Task[],
    onArchive: (task: Task) => void,
    onEdit: (task: Task) => void,
    onDelete: (task: Task) => void
}

function TaskList({ tasks, onArchive, onEdit, onDelete }: TaskListProps) {
    return (
        <List>
            <ListHeader className="sm:hidden xl:grid xl:grid-cols-[minmax(100px,400px)_minmax(100px,400px)_minmax(100px,400px)_minmax(200px,1fr)]">
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
            </ListHeader>
            {tasks?.length > 0 ?
                tasks.map(task => (
                    <ListRow
                        className={`xl:grid-cols-[minmax(100px,400px)_minmax(100px,400px)_minmax(100px,400px)_minmax(200px,1fr)] ${task.archived ? 'text-archive' : ''}`}
                        key={task.id}
                    >
                        <div className={`flex gap-1 items-center ${task.archived ? 'text-archive' : 'text-primary'}`}>
                            <StickyNote height={16} />
                            {task.name}
                        </div>
                        <div className={`gap-1 items-center ${!task.project ? 'hidden sm:flex' : 'flex'}`}>
                            {task.project && (
                                <>
                                    <NotepadText height={16} />
                                    {task.project?.name}
                                </>
                            )}
                        </div>
                        <div className={`gap-1 items-center ${!task.client ? 'hidden sm:flex' : 'flex'}`}>
                            {task.client && (
                                <>
                                    <User height={16} />
                                    {task.client?.name}
                                </>
                            )}
                        </div>
                        <div className={`${!task.description ? 'hidden sm:block' : 'block'}`}>
                            {task.description}
                        </div>
                        <ListActions
                            actions={[
                                {
                                    key: 'archive',
                                    icon: task.archived
                                        ? <Upload className="w-4 h-4 sm:w-auto sm:h-auto" />
                                        : <Download className="w-4 h-4 sm:w-auto sm:h-auto" />,
                                    onClick: () => onArchive(task)
                                },
                                { key: 'edit', icon: <Pencil className="w-4 h-4 sm:w-auto sm:h-auto" />, onClick: () => onEdit(task) },
                                { key: 'delete', icon: <Trash2 className="w-4 h-4 sm:w-auto sm:h-auto" />, onClick: () => onDelete(task) },
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