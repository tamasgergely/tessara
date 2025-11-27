import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Project, Task, Client } from '@/types';
import { useCallback } from 'react';
import { Head } from '@inertiajs/react';
import TaskList from '@/components/tasks/task-list';
import { Button } from "@/components/ui/button";
import { StickyNote } from "lucide-react";
import useEntityModals from '@/hooks/use-entity-modals';
import TaskFormModal from '@/components/tasks/task-form-modal';
import ConfirmDeleteModal from '@/components/modals/confirm-delete-modal';

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

    const {
        selected,
        isFormModalOpen,
        isDeleteModalOpen,
        openForm,
        openDeleteForm,
        closeModal
    } = useEntityModals<Task>();

    const handleEdit = useCallback((task: Task) => {
        openForm(task);
    }, [openForm]);

    const handleDelete = useCallback((task: Task) => {
        openDeleteForm(task);
    }, [openDeleteForm]);

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
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>

            <TaskFormModal
                visible={isFormModalOpen}
                task={selected}
                projects={projects}
                clients={clients}
                onClose={closeModal}
            />

            <ConfirmDeleteModal
                visible={isDeleteModalOpen}
                onClose={closeModal}
                id={selected?.id}
                name={selected?.name}
                description={`This action cannot be undone.`}
                model="task"
            />
        </AppLayout >
    );
}