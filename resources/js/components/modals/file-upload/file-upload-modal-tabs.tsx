import { Upload, FileText } from 'lucide-react';

type FileUploadModalTabsProps = {
    activeTab: 'files' | 'upload',
    setActiveTab: (tab: 'files' | 'upload') => void,
    uploadedFilesCount: number
}

export default function FileUploadModalTabs({ activeTab, setActiveTab, uploadedFilesCount }: FileUploadModalTabsProps) {
    return (
        <div className="flex border-b border-gray-800">
            <button
                onClick={() => setActiveTab('files')}
                className={`
                    flex items-center gap-2 px-6 py-4 font-medium transition-colors relative cursor-pointer text-sm sm:text-base
                    ${activeTab === 'files' ? 'text-primary' : 'text-foreground hover:text-primary'}
                `}
            >
                <FileText className="h-4 w-4" />
                Uploaded Files
                <span className="ml-1 px-2 py-0.5 text-xs rounded-full text-white bg-neutral-400 dark:bg-neutral-700">
                    {uploadedFilesCount}
                </span>
                {activeTab === 'files' && (
                    <div className="absolute -bottom-[1px] left-0 right-0 h-0.5 bg-primary" />
                )}
            </button>

            <button
                onClick={() => setActiveTab('upload')}
                className={`
                    flex items-center gap-2 px-6 py-4 font-medium transition-colors relative cursor-pointer text-sm sm:text-base
                    ${activeTab === 'upload' ? 'text-primary' : 'text-foreground hover:text-primary'}
                `}
            >
                <Upload className="h-4 w-4" />
                Upload New
                {activeTab === 'upload' && (
                    <div className="absolute -bottom-[1px] left-0 right-0 h-0.5 bg-primary" />
                )}
            </button>
        </div>

    );
}