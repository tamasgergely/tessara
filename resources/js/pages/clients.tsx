import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Client, PaginatedResponse, PaginationMetaLink } from '@/types';
import { useCallback } from 'react';
import { Head } from '@inertiajs/react';
import ClientList from '@/components/clients/client-list';
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import ClientFormModal from '@/components/clients/client-form-modal';
import ConfirmDeleteModal from '@/components/modals/confirm-delete-modal';
import ConfirmArchiveModal from '@/components/modals/confirm-archive-modal';
import { useClientModalStore } from '@/stores/modal-stores';
import ClientFilterForm from '@/components/clients/client-filter-form';
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
        title: 'Clients',
        href: ''
    },
];

export default function Clients({ clients }: { clients: PaginatedResponse<Client> }) {

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

            <div className="px-5 py-5">
                <div className="flex justify-between items-center mb-5">
                    <h1 className="text-2xl">Clients</h1>
                    <Button onClick={() => openForm()}>
                        <UserPlus /> Add client
                    </Button>
                </div>

                <ClientFilterForm />

                <ClientList
                    clients={clients.data}
                    onArchive={handleArchive}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />

                {clients.meta.last_page > 1 && (
                    <Pagination className="mt-5">
                        <PaginationContent>
                            {clients.meta?.links?.map((link: PaginationMetaLink, index: number) => {
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

            <ClientFormModal />

            <ConfirmDeleteModal
                useStore={useClientModalStore}
                description="All projects and tasks associated with this client will also be deleted."
                getSuccessMessage={() => 'Client deleted successfully!'}
                getErrorMessage={() => 'Failed to delete client. Please try again.'}
                getRouteName={() => 'clients.destroy'}
            />

            <ConfirmArchiveModal
                useStore={useClientModalStore}
                getDescription={
                    isArchived => isArchived
                        ? 'All projects, tasks and timers associated with this client will also be restored.'
                        : 'All projects, tasks and timers associated with this client will also be archived.'
                }
                getSuccessMessage={
                    entity => entity.archived
                        ? `${entity.name ? entity.name : 'Client'} restored successfully.`
                        : `${entity.name ? entity.name : 'Client'} archived successfully.`
                }
                getErrorMessage={
                    entity => entity.archived
                        ? 'Failed to restore client! Please try again.'
                        : 'Failed to archive client. Please try again.'
                }
                getRouteName={() => 'clients.toggle-archive'}
            />
        </AppLayout >
    );
}