import { useState } from "react";

type ModalType = 'form' | 'delete' | 'archive' | null;

export default function useEntityModals<T>() {

    const [selected, setSelected] = useState<T | null>(null);
    const [modalType, setModalType] = useState<ModalType>(null);

    const openForm = (entity: T | null = null) => {
        setSelected(entity);
        setModalType('form');
    }

    const openDeleteForm = (entity: T) => {
        setSelected(entity);
        setModalType('delete');
    };

    const openArchiveForm = (entity: T) => {
        setSelected(entity);
        setModalType('archive');
    };

    const closeModal = () => {
        setSelected(null);
        setModalType(null);
    };

    return {
        selected,
        modalType,
        isFormModalOpen: modalType === 'form',
        isDeleteModalOpen: modalType === 'delete',
        isArchiveModalOpen: modalType === 'archive',
        openForm,
        openDeleteForm,
        openArchiveForm,
        closeModal,
    };
}