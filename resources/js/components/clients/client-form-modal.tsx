import Modal from '@/components/modal';
import ClientForm from './client-form';
import ModalHead from '../modal-head';
import { useClientModalStore } from '@/stores/modal-stores';

export default function ClientFormModal() {

    const isFormModalOpen = useClientModalStore((state) => state.isFormModalOpen);
    const selected = useClientModalStore((state) => state.selected);
    const closeModal = useClientModalStore((state) => state.closeModal);

    return (
        <Modal visible={isFormModalOpen} onClose={closeModal}>
            <div className="flex flex-col absolute inset-0">
                <ModalHead title={selected  ? 'Edit Client' : 'Add New Client'} />
                <ClientForm client={selected} onClose={closeModal} visible={isFormModalOpen} />
            </div>
        </Modal>
    );
}