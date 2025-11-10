import type { Client } from '@/types';
import Modal from '@/components/modal';
import ClientForm from './client-form';
import ModalHead from '../modal-head';

export default function ClientFormModal({ visible, client, onClose }: { visible: boolean, client: Client | null, onClose: () => void }) {

    return (
        <Modal visible={visible} onClose={onClose}>
            <div className="flex flex-col absolute inset-0">
                <ModalHead title={client ? 'Edit Client' : 'Add New Client'} />
                <ClientForm client={client} onClose={onClose} visible={visible} />
            </div>
        </Modal>
    );
}