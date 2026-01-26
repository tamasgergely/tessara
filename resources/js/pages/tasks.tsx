import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Project, Task, Client } from '@/types';
import { useCallback } from 'react';
import { Head } from '@inertiajs/react';
import TaskList from '@/components/tasks/task-list';
import { Button } from "@/components/ui/button";
import { StickyNote } from "lucide-react";
import TaskFormModal from '@/components/tasks/task-form-modal';
import ConfirmDeleteModal from '@/components/modals/confirm-delete-modal';
import ConfirmArchiveModal from '@/components/modals/confirm-archive-modal';
import { useTaskModalStore } from '@/stores/modal-stores';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tasks',
        href: ''
    },
];

type TaskProps = {
    tasks: Task[],
    projects: Project[],
    clients: Client[]
}

export default function Tasks({ tasks, projects, clients }: TaskProps) {

    const openForm = useTaskModalStore(state => state.openForm);
    const openDeleteForm = useTaskModalStore(state => state.openDeleteForm);
    const openArchiveForm = useTaskModalStore((state) => state.openArchiveForm);

    const handleEdit = useCallback((task: Task) => {
        openForm(task);
    }, [openForm]);

    const handleDelete = useCallback((task: Task) => {
        openDeleteForm(task);
    }, [openDeleteForm]);

    const handleArchive = useCallback((task: Task) => {
        openArchiveForm(task);
    }, [openArchiveForm]);

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

                <TaskList
                    tasks={tasks}
                    onArchive={handleArchive}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
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

        </AppLayout >
    );
}