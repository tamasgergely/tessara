import type { Project, Client } from '@/types';
import Modal from '@/components/modal';
import ProjectForm from './project-form';
import ModalHead from '../modal-head';

export default function ProjectFormModal({ visible, project, clients, onClose }: { visible: boolean, project: Project | null, clients: Client[], onClose: () => void }) {

    return (
        <Modal visible={visible} onClose={onClose}>
            <div className="flex flex-col absolute inset-0">
                <ModalHead title={project ? 'Edit Project' : 'Add New Project'} />
                <ProjectForm project={project} clients={clients} onClose={onClose} visible={visible} />
            </div>
        </Modal>
    );
}