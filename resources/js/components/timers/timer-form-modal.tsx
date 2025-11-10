import type { Timer, Project, Task, Client } from '@/types';
import Modal from '@/components/modal';
import TimerCreateForm from './timer-create-form';
import TimerEditForm from './timer-edit-form';
import ModalHead from '../modal-head';

type TimerFormModalProps = {
    visible: boolean,
    timer: Timer | null,
    projects: Project[],
    tasks: Task[],
    clients: Client[]
    onClose: () => void
}

export default function TimerFormModal({ visible, timer, projects, tasks, clients, onClose }: TimerFormModalProps) {

    return (
        <Modal visible={visible} onClose={onClose}>
            <div className="flex flex-col absolute inset-0">
                <ModalHead title={timer ? 'Edit Time Entry' : 'Add New Time Entry'} />

                {timer ?
                    <TimerEditForm
                        timer={timer}
                        projects={projects}
                        clients={clients}
                        onClose={onClose}
                        visible={visible}
                    />
                    : <TimerCreateForm
                        projects={projects}
                        tasks={tasks}
                        clients={clients}
                        onClose={onClose}
                        visible={visible}
                    />
                }
            </div>
        </Modal>
    );
}