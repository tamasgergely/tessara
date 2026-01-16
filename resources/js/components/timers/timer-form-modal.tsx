import type { Timer, TimerInterval, Project, Task, Client } from '@/types';
import Modal from '@/components/modal';
import TimerCreateForm from './timer-create-form';
import TimerEditForm from './timer-edit-form';
import ModalHead from '../modal-head';
import { useTimerModalStore } from '@/stores/modal-stores';

type TimerFormModalProps = {
    projects: Project[],
    tasks: Task[],
    clients: Client[]
}

function isTimer(entity: Timer | TimerInterval | null): entity is Timer {
    return !!entity && 'project_id' in entity;
}

export default function TimerFormModal({ projects, tasks, clients }: TimerFormModalProps) {

    const isFormModalOpen = useTimerModalStore(state => state.isFormModalOpen);
    const closeModal = useTimerModalStore(state => state.closeModal);
    const selected = useTimerModalStore(state => state.selected);

    if (selected && !isTimer(selected)) {
        return null;
    }

    return (
        <Modal visible={isFormModalOpen} onClose={closeModal}>
            <div className="flex flex-col absolute inset-0">
                <ModalHead title={selected ? 'Edit Time Entry' : 'Add New Time Entry'} />

                {selected ?
                    <TimerEditForm
                        timer={selected}
                        projects={projects}
                        clients={clients}
                        onClose={closeModal}
                        visible={isFormModalOpen}
                    />
                    : <TimerCreateForm
                        projects={projects}
                        tasks={tasks}
                        clients={clients}
                        onClose={closeModal}
                        visible={isFormModalOpen}
                    />
                }
            </div>
        </Modal>
    );
}