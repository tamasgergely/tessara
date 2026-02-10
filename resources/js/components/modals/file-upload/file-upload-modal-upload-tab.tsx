import type { Identifiable } from "@/types";
import { useRef, useState } from "react";
import { useForm } from '@inertiajs/react'
import { X, Upload, FileText, Image, File, ChevronRight, ChevronLeft, LoaderCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from "@/components/ui/button";
import toast from 'react-hot-toast';

type UploadedFile = {
    id: number;
    file: File;
    name: string;
    size: number;
    type: string;
    title: string;
    description: string;
}

type FormData = {
    files: UploadedFile[],
}

type FileUploadModalUploadTabProps<T extends Identifiable> = {
    closeModal: () => void,
    item: T,
    setActiveTab: (type: 'files' | 'upload') => void,
    getRouteName: () => string,
}

export default function FileUploadModalUploadTab<T extends Identifiable>({ closeModal, item, setActiveTab, getRouteName }: FileUploadModalUploadTabProps<T>) {

    const fileInputRef = useRef<HTMLInputElement>(null)

    const MAX_FILES_PER_UPLOAD = 5;
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [step, setStep] = useState(1);

    const { data, setData, post, reset, processing, errors } = useForm<FormData>({
        files: [] as UploadedFile[]
    });

    const handleContinue = () => {
        if (data.files.length > 0) {
            setValidationErrors([]);
            setStep(2);
        }
    }

    const handleBack = () => {
        setStep(1);
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();

        const validFiles = validateFiles([...e.dataTransfer.files]);

        const droppedFiles: UploadedFile[] = validFiles.map((file, index) => ({
            id: Date.now() + index,
            file: file,
            name: file.name,
            size: file.size,
            type: file.type,
            title: '',
            description: ''
        }));

        setData('files', [...data.files, ...droppedFiles]);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        const selectedFiles = e.target.files;

        if (selectedFiles) {

            const validFiles = validateFiles([...selectedFiles]);

            const uploadedFiles: UploadedFile[] = validFiles.map((file, index) => {
                return {
                    id: Date.now() + index,
                    file: file,
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    title: '',
                    description: ''
                }
            });

            setData('files', [...data.files, ...uploadedFiles]);
        }
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const getFileIcon = (type: UploadedFile['type']) => {
        if (type.startsWith('image/')) return <Image className="h-5 w-5 text-blue-400" />;
        if (type.includes('pdf')) return <FileText className="h-5 w-5 text-primary" />;
        return <File className="h-5 w-5 text-foreground" />;
    }

    const removeFile = (id: UploadedFile['id']) => setData('files', data.files.filter(file => file.id !== id));

    const updateFileTitle = (id: UploadedFile['id'], title: UploadedFile['title']) => {
        setData('files', data.files.map(file => file.id === id ? { ...file, title } : file));
    }

    const updateFileDescription = (id: UploadedFile['id'], description: UploadedFile['description']) => {
        setData('files', data.files.map(file => file.id === id ? { ...file, description } : file));
    }

    const validateFiles = (files: File[]): File[] => {

        const errors = [];
        const validFiles: File[] = [];

        const remainingSlots = MAX_FILES_PER_UPLOAD - data.files.length;

        if (files.length > remainingSlots) {
            errors.push(`You can only add ${MAX_FILES_PER_UPLOAD} files per upload.`);

            if (remainingSlots === 0) {
                setValidationErrors(errors);
                return [];
            }

            files.splice(remainingSlots);
        }

        files.forEach(file => {
            if (file.size > MAX_FILE_SIZE) {
                errors.push(`"${file.name}": Exceeds 10MB limit (${formatFileSize(file.size)})`);
            } else if (!ALLOWED_TYPES.includes(file.type)) {
                errors.push(`"${file.name}": Unsupported file type (${file.type})`);
            } else {
                validFiles.push(file);
            }
        });

        if (errors.length > 0) {
            setValidationErrors(errors);
        }

        return validFiles;
    }

    const handleUpload = (e: React.MouseEvent<HTMLButtonElement>): void => {

        e.preventDefault();

        post(route(getRouteName(), item.id), {
            preserveScroll: true,
            preserveState: true,

            onSuccess: () => {
                setActiveTab('files');
                reset();
                setStep(1);
                toast.success('Files uploaded successfully!');
            },

            onError: (errors) => {
                setStep(1);
                reset();

                if (errors && Object.keys(errors).length > 0) {
                    setValidationErrors(Object.values(errors ?? {}));
                }
            }
        });
    };

    return (
        <>
            {/* Step indicator */}
            <div className="flex items-center justify-center gap-2 py-4 border-b border-border dark:border-gray-800">
                <div className={`flex items-center gap-2 ${step === 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                    <div
                        className={
                            `w-8 h-8 rounded-full flex items-center justify-center text-white
                                    ${step === 1 ? 'bg-primary' : 'bg-neutral-400 dark:bg-neutral-700'}`
                        }>
                        {step === 1 ? '1' : '✓'}
                    </div>
                    <span className="text-sm font-medium">Select Files</span>
                </div>
                <div className="w-12 h-0.5 bg-gray-700 mx-2" />
                <div className={`flex items-center gap-2 ${step === 2 ? 'text-primary' : 'text-muted-foreground'}`}>
                    <div className=
                        {`w-8 h-8 rounded-full flex items-center justify-center text-white ${step === 2 ? 'bg-primary ' : 'bg-neutral-400 dark:bg-neutral-700'}`}
                    >
                        2
                    </div>
                    <span className="text-sm font-medium">Add Details</span>
                </div>
            </div>

            {/* Validation errors */}
            {validationErrors.length > 0 && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4 my-5 m-6">
                    <p className="text-sm font-medium text-red-400 mb-2">
                        ⚠️ Some files were not added:
                    </p>
                    <ul className="text-xs text-red-400/80 space-y-1">
                        {validationErrors.map((error, index) => (
                            <li key={index}>• {error}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto min-h-0 p-6">
                {step === 1 ? (
                    // Step 1: File Selection
                    <div className="space-y-4">
                        {/* Drag & Drop Area */}
                        <div
                            className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                        >
                            <Upload className="mx-auto h-6 w-6 mb-4" />
                            <p className="text-md text-foreground mb-2">
                                Drag and drop files here, or click to select
                            </p>
                            <p className="text-xs textforeground">
                                Maximum 5 files per upload • 10MB per file • PDF, DOC, Images
                            </p>
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                className="hidden"
                                onChange={handleFileSelect}
                                accept="image/*,.pdf,.doc,.docx"
                            />
                        </div>
                        {/* Selected Files List */}
                        {data.files.length > 0 && (
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-foreground mb-2">
                                    Selected Files ({data.files.length})
                                </h3>
                                {data.files.map((file) => (
                                    <div
                                        key={file.id}
                                        className="flex items-center justify-between bg-background border border-border p-4 rounded-lg"
                                    >
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            {getFileIcon(file.type)}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-foreground break-all">
                                                    {file.name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {formatFileSize(file.size)}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeFile(file.id)}
                                            className="text-foreground hover:text-primary transition-colors ml-2 cursor-pointer"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    // Step 2: Metadata Entry
                    <div className="space-y-4">
                        {data.files.map((file, index) => (
                            <div
                                key={file.id}
                                className="border border-border rounded-lg p-5 "
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    {getFileIcon(file.type)}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-foreground truncate">{file.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            File {index + 1} of {data.files.length} • {formatFileSize(file.size)}
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">
                                            Title <span className="text-muted-foreground">(optional)</span>
                                        </Label>
                                        <Input
                                            id="name"
                                            className="mt-1 block w-full"
                                            value={file.title}
                                            required
                                            onChange={(e) => updateFileTitle(file.id, e.target.value)}
                                            placeholder="e.g., Requirements Document"
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="description">
                                            Description <span className="text-muted-foreground">(optional)</span>
                                        </Label>
                                        <Textarea
                                            className="min-h-12"
                                            id="description"
                                            value={file.description}
                                            onChange={(e) => updateFileDescription(file.id, e.target.value)}
                                            placeholder="Add any notes or context about this file..."
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 p-6 border-t border-border dark:border-gray-800">
                {step === 1 ? (
                    <div className="flex justify-between items-center">
                        <Button
                            type="button"
                            variant="ghost"
                            size="lg"
                            onClick={closeModal}
                        >
                            Cancel
                        </Button>
                        <Button
                            size="lg"
                            disabled={data.files.length === 0}
                            onClick={handleContinue}>
                            Continue
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                ) : (
                    <div className="flex justify-between items-center">
                        <Button
                            type="button"
                            variant="ghost"
                            size="lg"
                            onClick={handleBack}
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Back
                        </Button>
                        <div className="flex gap-3">
                            <Button
                                size="lg"
                                type="submit"
                                disabled={data.files.length === 0 || processing}
                                onClick={handleUpload}
                            >
                                {processing ? (
                                    <>
                                        <LoaderCircle className="h-4 w-4 animate-spin mr-2" aria-hidden="true" />
                                        <span>Uploading...</span>
                                    </>
                                ) : (
                                    <>
                                        Upload
                                        <Upload className="h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
