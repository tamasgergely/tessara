import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Project, Task, Client, PaginatedResponse, PaginationMetaLink } from '@/types';
import { useCallback } from 'react';
import { Head } from '@inertiajs/react';
import TaskList from '@/components/tasks/task-list';
import { Button } from "@/components/ui/button";
import { StickyNote } from "lucide-react";
import TaskFormModal from '@/components/tasks/task-form-modal';
import ConfirmDeleteModal from '@/components/modals/confirm-delete-modal';
import ConfirmArchiveModal from '@/components/modals/confirm-archive-modal';
import { useTaskModalStore } from '@/stores/modal-stores';
import FileUploadModal from '@/components/modals/file-upload/file-upload-modal';
import TaskFilterForm from '@/components/tasks/task-filter-form';
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
        title: 'Tasks',
        href: ''
    },
];

type TaskProps = {
    tasks: PaginatedResponse<Task>,
    projects: Project[],
    clients: Client[]
}

export default function Tasks({ tasks, projects, clients }: TaskProps) {

    const openForm = useTaskModalStore(state => state.openForm);
    const openDeleteForm = useTaskModalStore(state => state.openDeleteForm);
    const openArchiveForm = useTaskModalStore((state) => state.openArchiveForm);
    const openFileUploadForm = useTaskModalStore(state => state.openFileUploadForm);

    const handleEdit = useCallback((task: Task) => {
        openForm(task);
    }, [openForm]);

    const handleDelete = useCallback((task: Task) => {
        openDeleteForm(task);
    }, [openDeleteForm]);

    const handleArchive = useCallback((task: Task) => {
        openArchiveForm(task);
    }, [openArchiveForm]);

    const handleFileUpload = useCallback((task: Task) => {
        openFileUploadForm(task);
    }, [openFileUploadForm]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tasks" />

            <div className="px-5">
                <div className="flex justify-between items-center mb-5">
                    <h1 className="text-2xl">Tasks</h1>
                    <Button onClick={() => openForm()}>
                        <StickyNote /> Add task
                    </Button>
                </div>

                <TaskFilterForm
                    initialClients={clients}
                    initialProjects={projects}
                />

                <TaskList
                    tasks={tasks.data}
                    onArchive={handleArchive}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onFileUpload={handleFileUpload}
                />

                {tasks.meta.last_page > 1 && (
                    <Pagination className="mt-5">
                        <PaginationContent>
                            {tasks.meta?.links?.map((link: PaginationMetaLink, index: number) => {
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

            <TaskFormModal
                projects={projects}
                clients={clients}
            />

            <ConfirmDeleteModal
                useStore={useTaskModalStore}
                description="This action cannot be undone."
                getSuccessMessage={() => 'Task deleted successfully!'}
                getErrorMessage={() => 'Failed to delete task. Please try again.'}
                getRouteName={() => 'tasks.destroy'}
            />

            <ConfirmArchiveModal
                useStore={useTaskModalStore}
                getDescription={
                    isArchived => isArchived
                        ? 'All timers associated with this task will also be restored.'
                        : 'All timers associated with this task will also be archived.'
                }
                getSuccessMessage={
                    entity => entity.archived
                        ? `${entity.name ? entity.name : 'Task'} restored successfully.`
                        : `${entity.name ? entity.name : 'Task'} archived successfully.`
                }
                getErrorMessage={
                    entity => entity.archived
                        ? 'Failed to restore task! Please try again.'
                        : 'Failed to archive task. Please try again.'
                }
                getRouteName={() => 'tasks.toggle-archive'}
            />

            <FileUploadModal
                useStore={useTaskModalStore}
                items={tasks.data}
                getRouteName={() => 'tasks.files.store'}
            />
        </AppLayout >
    );
}