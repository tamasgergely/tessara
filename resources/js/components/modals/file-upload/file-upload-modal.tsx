import type { Identifiable } from '@/types';
import Modal from '@/components/modal';
import FileUploadModalContent from './file-upload-modal-content';

type ConfirmArchiveModalProps<T> = {
    useStore: any,
    items: T[],
    getRouteName: () => string,
}

export default function FileUploadModal<T extends Identifiable>({ useStore, items, getRouteName }: ConfirmArchiveModalProps<T>) {

    const isUploadFileModalOpen = useStore(state => state.isUploadFileModalOpen);
    const closeModal = useStore(state => state.closeModal);

    return (
        <Modal
            visible={isUploadFileModalOpen}
            onClose={closeModal}
            variant="center"
            className="w-full max-w-3xl"
        >
            {isUploadFileModalOpen && (
                <FileUploadModalContent
                    useStore={useStore}
                    items={items}
                    closeModal={closeModal}
                    getRouteName={getRouteName}
                />
            )}
        </Modal>
    )
}