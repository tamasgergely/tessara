import type { Task, Project, Client } from '@/types';
import Modal from '@/components/modal';
import TaskForm from './task-form';
import ModalHead from '../modal-head';

type TaskFormModalProps = {
    visible: boolean,
    task: Task | null,
    projects: Project[],
    clients: Client[],
    onClose: () => void
}

export default function TaskFormModal({ visible, task, projects, clients, onClose }: TaskFormModalProps) {

    return (
        <Modal visible={visible} onClose={onClose}>
            <div className="flex flex-col absolute inset-0">
                <ModalHead title={task ? 'Edit Task' : 'Add New Task'} />

                <TaskForm
                    task={task}
                    projects={projects}
                    clients={clients}
                    onClose={onClose}
                    visible={visible}
                />
            </div>
        </Modal>
    );
}