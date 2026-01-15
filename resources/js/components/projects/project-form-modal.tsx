import type { Client } from '@/types';
import Modal from '@/components/modal';
import ProjectForm from './project-form';
import ModalHead from '../modal-head';
import { useProjectModalStore } from '@/stores/modal-stores';

type ProjectFormModalProps = {
    clients: Client[]
}

export default function ProjectFormModal({ clients }: ProjectFormModalProps) {

    const isFormModalOpen = useProjectModalStore(state => state.isFormModalOpen);
    const closeModal = useProjectModalStore(state => state.closeModal);
    const selected = useProjectModalStore(state => state.selected);

    return (
        <Modal visible={isFormModalOpen} onClose={closeModal}>
            <div className="flex flex-col absolute inset-0">
                <ModalHead
                    title={selected ? 'Edit Project' : 'Add New Project'}
                />
                <ProjectForm
                    project={selected}
                    clients={clients}
                    onClose={closeModal}
                    visible={isFormModalOpen}
                />
            </div>
        </Modal>
    );
}