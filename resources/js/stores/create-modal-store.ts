// create-modal-store.ts
import { create } from 'zustand';

type ModalType = 'form' | 'delete' | 'archive' | 'upload' | null;

interface ModalState<T> {
    formSelected: T | null;
    deleteSelected: T | null;
    archiveSelected: T | null;
    uploadSelected: T | null;
    
    modalType: ModalType;
    isFormModalOpen: boolean;
    isDeleteModalOpen: boolean;
    isArchiveModalOpen: boolean;
    isUploadFileModalOpen: boolean;
    
    openForm: (entity?: T | null) => void;
    openDeleteForm: (entity: T) => void;
    openArchiveForm: (entity: T) => void;
    openFileUploadForm: (entity: T) => void;
    updateSelected: (entity: T, modalType: ModalType) => void;
    closeModal: () => void;
}

export function createModalStore<T>() {
    return create<ModalState<T>>((set) => ({
        formSelected: null,
        deleteSelected: null,
        archiveSelected: null,
        uploadSelected: null,
        
        modalType: null,
        isFormModalOpen: false,
        isDeleteModalOpen: false,
        isArchiveModalOpen: false,
        isUploadFileModalOpen: false,
        
        openForm: (entity = null) => set({ 
            formSelected: entity,
            modalType: 'form',
            isFormModalOpen: true,
            isDeleteModalOpen: false,
            isArchiveModalOpen: false,
            isUploadFileModalOpen: false,
        }),
        
        openDeleteForm: (entity) => set({ 
            deleteSelected: entity,
            modalType: 'delete',
            isFormModalOpen: false,
            isDeleteModalOpen: true,
            isArchiveModalOpen: false,
            isUploadFileModalOpen: false,
        }),
        
        openArchiveForm: (entity) => set({ 
            archiveSelected: entity,
            modalType: 'archive',
            isFormModalOpen: false,
            isDeleteModalOpen: false,
            isArchiveModalOpen: true,
            isUploadFileModalOpen: false,
        }),

        openFileUploadForm: (entity) => set({
            uploadSelected: entity,
            modalType: 'file',
            isFormModalOpen: false,
            isDeleteModalOpen: false,
            isArchiveModalOpen: false,
            isUploadFileModalOpen: true,
        }),
        
        updateSelected: (entity, modalType) => set((state) => {
            switch(modalType) {
                case 'form':
                    return { formSelected: entity };
                case 'delete':
                    return { deleteSelected: entity };
                case 'archive':
                    return { archiveSelected: entity };
                case 'upload':
                    return { uploadSelected: entity };
                default:
                    return state;
            }
        }),

        closeModal: () => set({ 
            formSelected: null,
            deleteSelected: null,
            archiveSelected: null,
            uploadSelected: null,
            modalType: null,
            isFormModalOpen: false,
            isDeleteModalOpen: false,
            isArchiveModalOpen: false,
            isUploadFileModalOpen: false,
        }),
    }));
}