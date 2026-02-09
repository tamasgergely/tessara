import type { Project } from '@/types';
import FileUploadModalHead from './file-upload-modal-head';
import FileUploadModalTabs from './file-upload-modal-tabs';
import FileUploadModalFilesTab from './file-upload-modal-files-tab';
import FileUploadModalUploadTab from './file-upload-modal-upload-tab';
import { useState, useEffect } from 'react';

type FileUploadModalContentProps = {
    useStore: any,
    projects: Project[],
    closeModal: () => void
}

export default function FileUploadModalContent({ useStore, projects, closeModal }: FileUploadModalContentProps) {
    const updateSelected = useStore(state => state.updateSelected);
    const selected = useStore(state => state.uploadSelected);

    const [activeTab, setActiveTab] = useState<'files' | 'upload'>('files');

    useEffect(() => {
        if (selected?.id) {
            const freshProject = projects.find(p => p.id === selected.id);
            if (freshProject) {
                updateSelected(freshProject, 'upload');
            }
        }
    }, [projects]);

    return (
        <div className="w-full max-h-[80vh] flex flex-col">
            <FileUploadModalHead
                activeTab={activeTab}
                project={selected}
            />

            <FileUploadModalTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                uploadedFilesCount={selected?.files?.length}
            />

            {activeTab === 'files' ? (
                <FileUploadModalFilesTab files={selected?.files} />
            ) : (
                <FileUploadModalUploadTab
                    closeModal={closeModal}
                    project={selected}
                    setActiveTab={setActiveTab}
                />
            )}
        </div>
    );
}