import { useState } from "react";

type ModalType = 'form' | 'delete' | null;

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

    const closeModal = () => {
        setSelected(null);
        setModalType(null);
    };

    return {
        selected,
        modalType,
        isFormModalOpen: modalType === 'form',
        isDeleteModalOpen: modalType === 'delete',
        openForm,
        openDeleteForm,
        closeModal,
    };
}