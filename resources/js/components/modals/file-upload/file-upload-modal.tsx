import type { Project } from '@/types';
import Modal from '@/components/modal';
import FileUploadModalContent from './file-upload-modal-content';

type ConfirmArchiveModalProps = {
    useStore: any,
    projects: Project[]
}

export default function FileUploadModal({ useStore, projects }: ConfirmArchiveModalProps) {

    const isUploadFileModalOpen = useStore(state => state.isUploadFileModalOpen);
    const closeModal = useStore(state => state.closeModal);

    console.log('render file upload modal');

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
                    projects={projects}
                    closeModal={closeModal}
                />
            )}
        </Modal>
    )
}