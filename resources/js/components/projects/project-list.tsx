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
            <ListHeader className="sm:hidden xl:grid xl:grid-cols-[minmax(150px,400px)_minmax(150px,400px)_minmax(300px,1fr)_60px]">
                <div>
                    Project
                </div>
                <div>
                    Client
                </div>
                <div>
                    Description
                </div>
                <div className="text-center">
                    Archived
                </div>
                <div></div>
            </ListHeader>

            {projects?.length > 0 ?
                projects.map(project => (
                    <ListRow className="xl:grid-cols-[minmax(150px,400px)_minmax(150px,400px)_minmax(300px,1fr)_60px]" key={project.id}>
                        <div className="flex gap-1 items-center text-primary">
                            <User height={16} />
                            {project.name}
                        </div>
                        <div className={`gap-1 items-center ${!project.client ? 'hidden sm:flex' : 'flex'}`}>
                            {project.client && (
                                <>
                                    <User height={16} />
                                    {project.client?.name}
                                </>
                            )}
                        </div>
                        <div className={`${!project.description ? 'hidden sm:block' : 'block'}`}>
                            {project.description}
                        </div>
                        <div className="hidden items-center xl:flex xl:gap-1 xl:justify-center">
                            <span aria-label={project.archived ? "Archived" : "Active"}>
                                {project.archived ? <Check /> : <X />}
                            </span>
                        </div>
                        <ListActions
                            actions={[
                                { key: 'edit', icon: <Pencil className="w-4 h-4 sm:w-auto sm:h-auto" />, onClick: () => onEdit(project) },
                                { key: 'delete', icon: <Trash2 className="w-4 h-4 sm:w-auto sm:h-auto" />, onClick: () => onDelete(project) },
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