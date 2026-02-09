import type { Option, FileItem } from "@/types";
import { useState, useCallback, useEffect } from "react";
import { FileSearch, FileText } from 'lucide-react';
import FileUploadModalFileCard from "./file-upload-modal-file-card";
import { Input } from '@/components/ui/input';
import SelectWrapper from '@/components/select-wrapper';

type FileUploadModalFilesTabProps = {
    files?: FileItem[];
};

type ActiveEditor =
    | { fileId: number; field: 'title' | 'description' }
    | null;

export default function FileUploadModalFilesTab({ files = [] }: FileUploadModalFilesTabProps) {

    const options: Option[] = [
        { value: 'all', label: 'All Files' },
        { value: 'pdf', label: 'PDFs' },
        { value: 'image', label: 'Images' },
        { value: 'document', label: 'Documents' }
    ];

    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<Option | null>(options[0]);
    const [activeEditor, setActiveEditor] = useState<ActiveEditor>(null);
    const [filesState, setFilesState] = useState<FileItem[]>(files);

    useEffect(() => {
        setFilesState(files);
    }, [files]);

    const filteredFiles = filesState?.filter(file => {
        const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            file.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            file.description?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesFilter = filterType?.value === 'all' ||
            (filterType?.value === 'pdf' && file.mime_type.includes('pdf')) ||
            (filterType?.value === 'image' && file.mime_type.startsWith('image')) ||
            (filterType?.value === 'document' && file.mime_type.includes('word'));

        return matchesSearch && matchesFilter;
    }) ?? [];

    const handleFilterChange = (option: Option | null) => {
        setFilterType(option || options[0]);
    };

    const onStartEdit = useCallback((editor: ActiveEditor) => {
        setActiveEditor(editor);
    }, []);

    return (
        <>
            {/* Search and Filter Bar - Fixed */}
            <div className="flex-shrink-0 p-6 border-b border-border dark:border-gray-800">
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_200px] gap-3">
                    <div className="relative">
                        <FileSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            id="name"
                            className="block w-full pl-10"
                            value={searchQuery}
                            required
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search files..."
                        />
                    </div>
                    <div className="relative">
                        <SelectWrapper
                            options={options}
                            value={filterType}
                            onChange={handleFilterChange}
                            getOptionLabel={c => c.label}
                            getOptionValue={c => c.value}
                            placeholder="Filter type"
                        />
                    </div>
                </div>
            </div>

            {/* Files List - Scrollable */}
            <div className="flex-1 overflow-y-auto min-h-0 p-6 space-y-3 scrollbar-thin">
                {filteredFiles.length > 0 ? (
                    filteredFiles.map((file) => (
                        <FileUploadModalFileCard
                            key={file.id}
                            file={file}
                            isTitleEditing={activeEditor?.fileId === file.id && activeEditor?.field === 'title'}
                            isDescriptionEditing={activeEditor?.fileId === file.id && activeEditor?.field === 'description'}
                            onStartEdit={onStartEdit}
                            setFilesState={setFilesState}
                        />

                    ))
                ) : (
                    <div className="text-center py-12">
                        <FileText className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No files found</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            {searchQuery ? 'Try adjusting your search' : 'Upload files to get started'}
                        </p>
                    </div>
                )}
            </div>

            {/* Footer - Fixed */}
            <div className="flex-shrink-0 p-4 border-t border-border dark:border-gray-800">
                <p className="text-sm text-muted-foreground text-center">
                    Showing {filteredFiles.length} of {files.length} files
                </p>
            </div>
        </>
    );
}