import type { Identifiable } from '@/types';
import FileUploadModalHead from './file-upload-modal-head';
import FileUploadModalTabs from './file-upload-modal-tabs';
import FileUploadModalFilesTab from './file-upload-modal-files-tab';
import FileUploadModalUploadTab from './file-upload-modal-upload-tab';
import { useState, useEffect } from 'react';

type FileUploadModalContentProps<T> = {
    useStore: any,
    items: T[];
    closeModal: () => void,
    getRouteName: () => string,
}

export default function FileUploadModalContent<T extends Identifiable>({ useStore, items, closeModal, getRouteName }: FileUploadModalContentProps<T>) {
    const updateSelected = useStore(state => state.updateSelected);
    const selected = useStore(state => state.uploadSelected);

    const [activeTab, setActiveTab] = useState<'files' | 'upload'>('files');

    useEffect(() => {
        if (selected?.id) {
            const freshItem = items.find(p => p.id === selected.id);
            if (freshItem) {
                updateSelected(freshItem, 'upload');
            }
        }
    }, [items]);

    return (
        <div className="w-full max-h-[80vh] flex flex-col">
            <FileUploadModalHead
                activeTab={activeTab}
                item={selected}
            />

            <FileUploadModalTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                uploadedFilesCount={selected?.files?.length ?? 0}
            />

            {activeTab === 'files' ? (
                <FileUploadModalFilesTab files={selected?.files} />
            ) : (
                <FileUploadModalUploadTab
                    closeModal={closeModal}
                    item={selected}
                    setActiveTab={setActiveTab}
                    getRouteName={getRouteName}
                />
            )}
        </div>
    );
}