import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Project, Client } from '@/types';
import { useCallback } from 'react';
import { Head } from '@inertiajs/react';
import ProjectList from '@/components/projects/project-list';
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import useEntityModals from '@/hooks/use-entity-modals';
import ProjectFormModal from '@/components/projects/project-form-modal';
import ConfirmDeleteModal from '@/components/modals/confirm-delete-modal';

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

    const {
        selected,
        isFormModalOpen,
        isDeleteModalOpen,
        openForm,
        openDeleteForm,
        closeModal
    } = useEntityModals<Project>();

    const handleEdit = useCallback((project: Project) => {
        openForm(project);
    }, [openForm]);

    const handleDelete = useCallback((project: Project) => {
        openDeleteForm(project);
    }, [openDeleteForm]);

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

                <ProjectList projects={projects} onEdit={handleEdit} onDelete={handleDelete} />
            </div>

            <ProjectFormModal visible={isFormModalOpen} project={selected} clients={clients} onClose={closeModal} />

            <ConfirmDeleteModal
                visible={isDeleteModalOpen}
                onClose={closeModal}
                id={selected?.id}
                name={selected?.name}
                description={`This action cannot be undone.`}
                model="project"
            />
        </AppLayout >
    );
}