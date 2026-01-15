import { create } from 'zustand';

type ModalType = 'form' | 'delete' | 'archive' | null;

interface ModalState<T> {
    selected: T | null;
    modalType: ModalType;
    isFormModalOpen: boolean;
    isDeleteModalOpen: boolean;
    isArchiveModalOpen: boolean;
    openForm: (entity?: T | null) => void;
    openDeleteForm: (entity: T) => void;
    openArchiveForm: (entity: T) => void;
    closeModal: () => void;
}

export function createModalStore<T>() {
    return create<ModalState<T>>((set) => ({
        selected: null,
        modalType: null,
        isFormModalOpen: false,
        isDeleteModalOpen: false,
        isArchiveModalOpen: false,
        
        openForm: (entity = null) => set({ 
            selected: entity, 
            modalType: 'form',
            isFormModalOpen: true,
            isDeleteModalOpen: false,
            isArchiveModalOpen: false,
        }),
        
        openDeleteForm: (entity) => set({ 
            selected: entity, 
            modalType: 'delete',
            isFormModalOpen: false,
            isDeleteModalOpen: true,
            isArchiveModalOpen: false,
        }),
        
        openArchiveForm: (entity) => set({ 
            selected: entity, 
            modalType: 'archive',
            isFormModalOpen: false,
            isDeleteModalOpen: false,
            isArchiveModalOpen: true,
        }),
        
        closeModal: () => set({ 
            selected: null, 
            modalType: null,
            isFormModalOpen: false,
            isDeleteModalOpen: false,
            isArchiveModalOpen: false,
        }),
    }));
}