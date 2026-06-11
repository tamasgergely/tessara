import type { FileItem } from "@/types";
import { useState, memo } from "react";
import { FileText, Image, File, ChevronDown, Eye, Download, Trash, Pencil, Check, X, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { formatToLocalTimeWithDate } from '@/utils/date-formatter';
import { router } from '@inertiajs/react'
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import InputError from '@/components/input-error';
import { getCookie } from "@/utils/cookie";

type ActiveEditor =
    | { fileId: number; field: 'title' | 'description' }
    | null;

type FileUploadModalFileCardProps = {
    file: FileItem;
    isTitleEditing: boolean;
    isDescriptionEditing: boolean;
    onStartEdit: (activeEditor: ActiveEditor) => void;
    setFilesState: React.Dispatch<React.SetStateAction<FileItem[]>>;
}

type ErrorType =
    | { title?: string, description?: string }
    | null;

function FileUploadModalFileCard({ file, isTitleEditing, isDescriptionEditing, onStartEdit, setFilesState }: FileUploadModalFileCardProps) {

    const [editValue, setEditValue] = useState<string>('');
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [errors, setErrors] = useState<ErrorType>(null);

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const getFileIcon = (type: string) => {
        if (type.startsWith('image/')) return <Image className="h-5 w-5 text-blue-400" />;
        if (type.includes('pdf')) return <FileText className="h-5 w-5 text-red-400" />;
        if (type.includes('word')) return <FileText className="h-5 w-5 text-blue-600" />;
        return <File className="h-5 w-5 text-gray-400" />;
    };

    const handleDownload = (file: FileItem) => {
        window.location.href = route('files.download', file.id);
    }

    const handleDelete = (file: FileItem) => {
        if (!confirm("Are you sure you want to delete this file?")) return;

        router.delete(route('files.destroy', file.id), {
            onSuccess: () => {
                toast.success('File deleted successfully!');
            },
            onError: (errors) => {
                toast.success('An error occurred while deleting the file.');
            },
        });
    }

    const handleView = (file: FileItem) => {
        const url = route('files.show', file.id);
        window.open(url, '_blank');
    }

    const startEditing = (activeEditor: ActiveEditor, currentValue: string) => {
        setErrors(null);
        onStartEdit(activeEditor);
        setEditValue(currentValue);
    };

    const cancelEditing = () => {
        onStartEdit(null);
        setErrors(null);
        setEditValue('');
    };

    const handleSave = async (file: FileItem, field: 'title' | 'description') => {

        if (field === 'title' && !isTitleEditing) return;
        if (field === 'description' && !isDescriptionEditing) return;

        try {
            const xsrfToken = getCookie('XSRF-TOKEN');

            const response = await fetch(route('files.update', file.id), {
                method: 'PATCH',
                headers: {
                    'X-XSRF-TOKEN': xsrfToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ [field]: editValue })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw (errorData);
            }

            setFilesState((prev: FileItem[]) =>
                prev.map(prevFile =>
                    prevFile.id === file.id
                        ? { ...prevFile, [field]: editValue }
                        : prevFile
                )
            );

            cancelEditing();

        } catch (error: any) {
            setErrors(error);
        }
    };

    return (
        <div className="border border-border rounded-lg overflow-hidden hover:border-gray-700 transition-colors w-full min-w-0">
            {/* Header - Always visible */}
            <div
                className="grid grid-cols-[1fr_auto] items-center gap-3 p-4 cursor-pointer bg-background transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="grid grid-cols-[auto_1fr] gap-3">
                    <div className="flex-shrink-0">
                        {getFileIcon(file.mime_type)}
                    </div>
                    <div className="min-w-0 flex-1 ">
                        <p className="font-medium text-foreground text-sm sm:text-base break-all">
                            {file.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {formatFileSize(file.size)} • {formatToLocalTimeWithDate(file.created_at)}
                        </p>
                    </div>
                </div>
                <div>
                    <ChevronDown
                        className={`h-5 w-5 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    />
                </div>
            </div>

            {/* Expanded Details */}
            {isExpanded && (
                <div className="px-4 pb-4 space-y-4 bg-background border-t border-border">
                    <label className="block text-xs font-medium text-foreground mb-1 pt-4">Title</label>
                    {isTitleEditing ? (
                        <>
                            <div className="flex items-center flex-1 gap-2">
                                <Input
                                    id="name"
                                    className="mt-1 block w-full"
                                    value={editValue}
                                    required
                                    autoFocus
                                    placeholder="Add title"
                                    onChange={(e) => setEditValue(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleSave(file, 'title');
                                        if (e.key === 'Escape') cancelEditing();
                                    }}
                                />

                                <button className="text-primary cursor-pointer" onClick={() => handleSave(file, 'title')}>
                                    <Check className="h-6 w-6" />
                                </button>
                                <button className="text-muted-foreground cursor-pointer" onClick={cancelEditing}>
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                            <div>
                                {errors?.title && <InputError message={errors.title} />}
                            </div>
                        </>
                    ) : (
                        <div className="flex gap-2 flex-1 group items-center">
                            <p className={`text-sm text-foreground break-words ${file.title ? '' : 'text-muted-foreground italic'}`}>
                                {file.title || 'Add title...'}
                            </p>
                            <button
                                onClick={() => startEditing({ fileId: file.id, field: 'title' }, file.title ?? '')}
                                className="text-muted-foreground opacity-0 group-hover:opacity-100 transition cursor-pointer"
                            >
                                <Pencil className="h-4 w-4" />
                            </button>
                        </div>
                    )}

                    <label className="block text-xs font-medium text-foreground mb-1 pt-4">Description</label>
                    {isDescriptionEditing ? (
                        <>
                            <div className="flex items-center flex-1 gap-2">
                                <Textarea
                                    className="min-h-12"
                                    id="description"
                                    value={editValue}
                                    autoFocus
                                    placeholder="Add Description"
                                    onChange={(e) => setEditValue(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Escape') cancelEditing();
                                    }}
                                />
                                <button className="text-primary cursor-pointer" onClick={() => handleSave(file, 'description')}>
                                    <Check className="h-6 w-6" />
                                </button>
                                <button className="text-muted-foreground cursor-pointer" onClick={cancelEditing}>
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                            <div>
                                {errors?.description && <InputError message={errors.description} />}
                            </div>
                        </>
                    ) : (
                        <div className="flex gap-2 flex-1 group items-center">
                            <p className={`text-sm text-foreground break-words ${file.description ? '' : 'text-muted-foreground italic'}`}>
                                {file.description || 'Add description...'}
                            </p>
                            <button
                                onClick={() => startEditing({ fileId: file.id, field: 'description' }, file.description ?? '')}
                                className="text-muted-foreground opacity-0 group-hover:opacity-100 transition cursor-pointer"
                            >
                                <Pencil className="h-4 w-4" />
                            </button>
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div>
                            <label className="block text-xs font-medium text-foreground mb-1">Uploaded by</label>
                            <p className="text-sm text-foreground">{file.user.name}</p>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-foreground mb-1">File size</label>
                            <p className="text-sm text-foreground">{formatFileSize(file.size)}</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                        <Button type="button" size="sm" onClick={() => handleView(file)}>
                            <Eye className="h-4 w-4" />
                            View
                        </Button>
                        <Button type="button" size="sm" onClick={() => handleDownload(file)}>
                            <Download className="h-4 w-4" />
                            Download
                        </Button>
                        <Button className="sm:ml-auto" variant="destructive" size="sm" onClick={() => handleDelete(file)}>
                            <Trash className="h-4 w-4" />
                            Delete
                        </Button>
                    </div>
                </div >
            )
            }
        </div >
    );
}

export default memo(FileUploadModalFileCard);