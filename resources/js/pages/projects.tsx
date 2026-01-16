import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Project, Client } from '@/types';
import { useCallback } from 'react';
import { Head } from '@inertiajs/react';
import ProjectList from '@/components/projects/project-list';
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import ProjectFormModal from '@/components/projects/project-form-modal';
import ConfirmDeleteModal from '@/components/modals/confirm-delete-modal';
import ConfirmArchiveModal from '@/components/modals/confirm-archive-modal';
import { useProjectModalStore } from '@/stores/modal-stores';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Projects',
        href: ''
    },
];

type ProjectsProps = {
    projects: Project[],
    clients: Client[]
}

export default function Projects({ projects, clients }: ProjectsProps) {

    const openForm = useProjectModalStore(state => state.openForm);
    const openDeleteForm = useProjectModalStore(state => state.openDeleteForm);
    const openArchiveForm = useProjectModalStore(state => state.openArchiveForm);

    const handleEdit = useCallback((project: Project) => {
        openForm(project);
    }, [openForm]);

    const handleDelete = useCallback((project: Project) => {
        openDeleteForm(project);
    }, [openDeleteForm]);

    const handleArchive = useCallback((project: Project) => {
        openArchiveForm(project);
    }, [openArchiveForm]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Projects" />

            <div className="px-5">
                <div className="flex justify-between items-center mb-5">
                    <h1 className="text-2xl">Projects</h1>
                    <Button onClick={() => openForm()}>
                        <UserPlus /> Add project
                    </Button>
                </div>

                <ProjectList
                    projects={projects}
                    onArchive={handleArchive}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>

            <ProjectFormModal
                clients={clients}
            />

            <ConfirmDeleteModal
                useStore={useProjectModalStore}
                description="This action cannot be undone."
                getSuccessMessage={() => 'Project deleted successfully!'}
                getErrorMessage={() => 'Failed to delete project. Please try again.'}
                getRouteName={() => 'projects.destroy'}
            />

            <ConfirmArchiveModal
                useStore={useProjectModalStore}
                getDescription={
                    isArchived => isArchived
                        ? 'All tasks and timers associated with this project will also be restored.'
                        : 'All tasks and timers associated with this project will also be archived.'
                }
                getSuccessMessage={
                    entity => entity.archived
                        ? `${entity.name ? entity.name : 'Project'} restored successfully.`
                        : `${entity.name ? entity.name : 'Project'} archived successfully.`
                }
                getErrorMessage={
                    entity => entity.archived
                        ? 'Failed to restore project! Please try again.'
                        : 'Failed to archive project. Please try again.'
                }
                getRouteName={() => 'projects.toggle-archive'}
            />
        </AppLayout >
    );
}