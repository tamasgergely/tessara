import React from 'react';
import type { Project } from '@/types';
import { User } from 'lucide-react';
import List from '@/components/list/list';
import ListHeader from '@/components/list/list-header';
import ListRow from '@/components/list/list-row';
import ListActions from '@/components/list/list-actions';

type ProjectListProps = {
    projects: Project[],
    onArchive: (project: Project) => void,
    onEdit: (project: Project) => void,
    onDelete: (project: Project) => void,
    onFileUpload: (project: Project) => void
}

function ProjectList({ projects, onArchive, onEdit, onDelete, onFileUpload }: ProjectListProps) {

    return (
        <List>
            <ListHeader className="sm:hidden xl:grid xl:grid-cols-[minmax(150px,400px)_minmax(150px,400px)_minmax(300px,1fr)]">
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
            </ListHeader>

            {projects?.length > 0 ?
                projects.map(project => (
                    <ListRow className={`xl:grid-cols-[minmax(150px,400px)_minmax(150px,400px)_minmax(300px,1fr)] ${project.archived ? 'text-archive' : ''}`}
                        key={project.id}
                    >
                        <div className={`flex gap-1 items-center ${project.archived ? 'text-archive' : 'text-primary'}`}>
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
                        <ListActions
                            onFileUpload={() => onFileUpload(project)}
                            onArchive={() => onArchive(project)}
                            onEdit={() => onEdit(project)}
                            onDelete={() => onDelete(project)}
                            entity={project}
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