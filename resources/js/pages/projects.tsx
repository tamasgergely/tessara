import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Project, Client, PaginatedResponse, PaginationMetaLink } from '@/types';
import { useCallback } from 'react';
import { Head } from '@inertiajs/react';
import ProjectList from '@/components/projects/project-list';
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import ProjectFormModal from '@/components/projects/project-form-modal';
import ConfirmDeleteModal from '@/components/modals/confirm-delete-modal';
import ConfirmArchiveModal from '@/components/modals/confirm-archive-modal';
import { useProjectModalStore } from '@/stores/modal-stores';
import FileUploadModal from '@/components/modals/file-upload/file-upload-modal';
import ProjectFilterForm from '@/components/projects/project-filter-form';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Projects',
        href: ''
    },
];

type ProjectsProps = {
    projects: PaginatedResponse<Project>,
    clients: Client[]
}

export default function Projects({ projects, clients }: ProjectsProps) {

    const openForm = useProjectModalStore(state => state.openForm);
    const openDeleteForm = useProjectModalStore(state => state.openDeleteForm);
    const openArchiveForm = useProjectModalStore(state => state.openArchiveForm);
    const openFileUploadForm = useProjectModalStore(state => state.openFileUploadForm);

    const handleEdit = useCallback((project: Project) => {
        openForm(project);
    }, [openForm]);

    const handleDelete = useCallback((project: Project) => {
        openDeleteForm(project);
    }, [openDeleteForm]);

    const handleArchive = useCallback((project: Project) => {
        openArchiveForm(project);
    }, [openArchiveForm]);

    const handleFileUpload = useCallback((project: Project) => {
        openFileUploadForm(project);
    }, [openFileUploadForm]);

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

                <ProjectFilterForm
                    initialClients={clients}
                />

                <ProjectList
                    projects={projects.data}
                    onArchive={handleArchive}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onFileUpload={handleFileUpload}
                />

                {projects.meta.last_page > 1 && (
                    <Pagination className="mt-5">
                        <PaginationContent>
                            {projects.meta?.links?.map((link: PaginationMetaLink, index: number) => {
                                if (link.label === '...') {
                                    return (
                                        <PaginationItem key={index}>
                                            <PaginationEllipsis />
                                        </PaginationItem>
                                    );
                                }

                                if (link.label.includes('Previous')) {
                                    return link.url ? (
                                        <PaginationItem key={index}>
                                            <PaginationPrevious href={link.url} />
                                        </PaginationItem>
                                    ) : null;
                                }

                                if (link.label.includes('Next')) {
                                    return link.url ? (
                                        <PaginationItem key={index}>
                                            <PaginationNext href={link.url} />
                                        </PaginationItem>
                                    ) : null;
                                }

                                return (
                                    <PaginationItem key={index}>
                                        <PaginationLink href={link.url || '#'} isActive={link.active}>
                                            {link.label}
                                        </PaginationLink>
                                    </PaginationItem>
                                );
                            })}
                        </PaginationContent>
                    </Pagination>
                )}
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

            <FileUploadModal
                useStore={useProjectModalStore}
                items={projects.data}
                getRouteName={() => 'projects.files.store'}
            />
        </AppLayout >
    );
}