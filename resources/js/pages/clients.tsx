import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Client } from '@/types';
import { useCallback } from 'react';
import { Head } from '@inertiajs/react';
import ClientList from '@/components/clients/client-list';
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import ClientFormModal from '@/components/clients/client-form-modal';
import ConfirmDeleteModal from '@/components/modals/confirm-delete-modal';
import ConfirmArchiveModal from '@/components/modals/confirm-archive-modal';
import { useClientModalStore } from '@/stores/modal-stores';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Clients',
        href: ''
    },
];

export default function Clients({ clients }: { clients: Client[] }) {

    const openForm = useClientModalStore((state) => state.openForm);
    const openDeleteForm = useClientModalStore((state) => state.openDeleteForm);
    const openArchiveForm = useClientModalStore((state) => state.openArchiveForm);

    const handleEdit = useCallback((client: Client) => {
        openForm(client);
    }, [openForm]);

    const handleDelete = useCallback((client: Client) => {
        openDeleteForm(client);
    }, [openDeleteForm]);

    const handleArchive = useCallback((client: Client) => {
        openArchiveForm(client);
    }, [openArchiveForm]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Clients" />

            <div className="px-5">
                <div className="flex justify-between items-center mb-5">
                    <h1 className="text-2xl">Clients</h1>
                    <Button onClick={() => openForm()}>
                        <UserPlus /> Add client
                    </Button>
                </div>

                <ClientList
                    clients={clients}
                    onArchive={handleArchive}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>

            <ClientFormModal />

            <ConfirmDeleteModal
                useStore={useClientModalStore}
                description="All projects and tasks associated with this client will also be deleted."
                getSuccessMessage={() => 'Client deleted successfully!'}
                getErrorMessage={() => 'Failed to delete client. Please try again.'}
                getRouteName={() => 'clients.destroy'}
            />

            <ConfirmArchiveModal
                getDescription={
                    isArchived => isArchived
                        ? 'All projects, tasks and timers associated with this client will also be restored.'
                        : 'All projects, tasks and timers associated with this client will also be archived.'
                }
                model="client"
            />
        </AppLayout >
    );
}