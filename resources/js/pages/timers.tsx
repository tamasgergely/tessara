import AppLayout from '@/layouts/app-layout';
import type { Project, BreadcrumbItem, Timer, TimerInterval, Task, Client } from '@/types';
import { useCallback } from 'react';
import { Head } from '@inertiajs/react';
import useEntityModals from '@/hooks/use-entity-modals';
import TimerFormModal from '@/components/timers/timer-form-modal';
import ConfirmDeleteModal from '@/components/modals/confirm-delete-modal';
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import TimerList from '@/components/timers/timer-list';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Time entries',
        href: ''
    },
];

type TimersProps = {
    timers: Timer[],
    tasks: Task[],
    projects: Project[],
    clients: Client[]
}

export default function Timers({ timers, tasks, projects, clients }: TimersProps) {

    const {
        selected,
        isFormModalOpen,
        isDeleteModalOpen,
        openForm,
        openDeleteForm,
        closeModal
    } = useEntityModals<Timer | TimerInterval>();

    const handleEdit = useCallback((timer: Timer) => {
        openForm(timer);
    }, [openForm]);

    const handleDelete = useCallback((item: Timer | TimerInterval) => {
        openDeleteForm(item);
    }, [openDeleteForm]);

    function isTimer(entity: Timer | TimerInterval | null): entity is Timer {
        return !!entity && 'project_id' in entity;
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Timers" />

            <div className="pt-2 px-2 md:px-5">
                <div className="flex justify-between items-center px-2 mb-5 lg:px-0">
                    <h1 className="text-2xl">Time entries</h1>
                    <Button onClick={() => openForm()}>
                        <Clock /> Add time entry
                    </Button>
                </div>

                <TimerList timers={timers} onEdit={handleEdit} onDelete={handleDelete} />
            </div>

            <TimerFormModal
                visible={isFormModalOpen}
                timer={isTimer(selected) ? selected : null}
                projects={projects}
                tasks={tasks}
                clients={clients}
                onClose={closeModal}
            />

            <ConfirmDeleteModal
                visible={isDeleteModalOpen}
                onClose={closeModal}
                id={selected?.id}
                description={`This action cannot be undone.`}
                model={isTimer(selected) ? 'timer' : 'time-interval'}
            />
        </AppLayout>
    );
}