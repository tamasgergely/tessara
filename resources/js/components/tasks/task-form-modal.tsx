import type { Project, Client } from '@/types';
import Modal from '@/components/modal';
import TaskForm from './task-form';
import ModalHead from '../modal-head';
import { useTaskModalStore } from '@/stores/modal-stores';

type TaskFormModalProps = {
    projects: Project[],
    clients: Client[],
}

export default function TaskFormModal({ projects, clients }: TaskFormModalProps) {

    const isFormModalOpen = useTaskModalStore(state => state.isFormModalOpen);
    const closeModal = useTaskModalStore(state => state.closeModal);
    const selected = useTaskModalStore(state => state.selected);

    return (
        <Modal visible={isFormModalOpen} onClose={closeModal}>
            <div className="flex flex-col absolute inset-0">
                <ModalHead title={selected ? 'Edit Task' : 'Add New Task'} />

                <TaskForm
                    task={selected}
                    projects={projects}
                    clients={clients}
                    onClose={closeModal}
                    visible={isFormModalOpen}
                />
            </div>
        </Modal>
    );
}