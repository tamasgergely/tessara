import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Client } from '@/types';
import { useCallback} from 'react';
import { Head } from '@inertiajs/react';
import ClientList from '@/components/clients/client-list';
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import useEntityModals from '@/hooks/use-entity-modals';
import ClientFormModal from '@/components/clients/client-form-modal';
import ConfirmDeleteModal from '@/components/modals/confirm-delete-modal';

const breadcrumbs: BreadcrumbItem[] = [
    // {
    //     title: 'Dashboard',
    //     href: '/dashboard',
    // },
    {
        title: 'Clients',
        href: ''
    },
];

export default function Clients({ clients }: { clients: Client[] }) {

    const {
        selected,
        isFormModalOpen,
        isDeleteModalOpen,
        openForm,
        openDeleteForm,
        closeModal
    } = useEntityModals<Client>();

    const handleEdit = useCallback((client: Client) => {
        openForm(client);
    }, [openForm]);

    const handleDelete = useCallback((client: Client) => {
        openDeleteForm(client);
    }, [openDeleteForm]);

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

                <ClientList clients={clients} onEdit={handleEdit} onDelete={handleDelete} />
            </div>

            <ClientFormModal visible={isFormModalOpen} client={selected} onClose={closeModal} />

            <ConfirmDeleteModal
                visible={isDeleteModalOpen}
                onClose={closeModal}
                id={selected?.id}
                name={selected?.name}
                description="All projects and tasks associated with this client will also be deleted."
                model="client"
            />
        </AppLayout >
    );
}