import React from 'react';
import type { Project } from '@/types';
import { User, X, Check, Trash2, Pencil } from 'lucide-react';
import List from '@/components/list/list';
import ListHeader from '@/components/list/list-header';
import ListRow from '@/components/list/list-row';
import ListActions from '@/components/list/list-actions';

type ProjectListProps = {
    projects: Project[],
    onEdit: (project: Project) => void,
    onDelete: (project: Project) => void
}

function ProjectList({ projects, onEdit, onDelete }: ProjectListProps) {

    return (
        <List>
            <ListHeader className="hidden md:grid-cols-[minmax(100px,400px)_minmax(100px,400px)_minmax(200px,600px)_1fr_60px]">
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

            {projects?.length > 0 ?
                projects.map(project => (
                    <ListRow className="md:grid-cols-[minmax(100px,400px)_minmax(100px,400px)_minmax(200px,600px)_1fr_60px]" key={project.id}>
                        <div className="flex gap-1 items-center">
                            <User height={16} />
                            {project.name}
                        </div>
                        <div className="flex gap-1 items-center">
                            {project.client && (
                                <>
                                    <User height={16} />
                                    {project.client?.name}
                                </>
                            )}
                        </div>
                        <div className="">
                            {project.description}
                        </div>
                        <div></div>
                        <div className="md:flex gap-1 items-center justify-center hidden">
                            <span aria-label={project.archived ? "Archived" : "Active"}>
                                {project.archived ? <Check /> : <X />}
                            </span>
                        </div>
                        <ListActions
                            actions={[
                                { key: 'edit', icon: <Pencil />, onClick: () => onEdit(project) },
                                { key: 'delete', icon: <Trash2 />, onClick: () => onDelete(project) },
                            ]}
                        />
                    </ListRow>
                ))

                : <div className="pt-3">
                    No projects found.
                </div>
            }
        </List>
    )
}

export default React.memo(ProjectList);