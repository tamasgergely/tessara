import { useForm } from '@inertiajs/react'
import Modal from '@/components/modal';
import { Button } from "@/components/ui/button";
import { LoaderCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { ArchiveableEntity } from '@/types';

type ConfirmArchiveModalProps = {
    useStore: any,
    getRouteName: (entity: ArchiveableEntity) => string,
    getDescription?: (isArchived: boolean) => string;
    getSuccessMessage?: (entity: ArchiveableEntity) => string,
    getErrorMessage?: (entity: ArchiveableEntity) => string
}

export default function ConfirmArchiveModal({ useStore, getRouteName, getDescription, getSuccessMessage, getErrorMessage }: ConfirmArchiveModalProps) {

    const isArchiveModalOpen = useStore(state => state.isArchiveModalOpen);
    const selected = useStore(state => state.selected);
    const closeModal = useStore(state => state.closeModal);

    const { patch, processing } = useForm();
    const submitRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (submitRef.current) {
            submitRef.current.focus();
        }
    }, [isArchiveModalOpen]);

    const action = selected?.archived ? 'restore' : 'archive';

    const handleArchive = () => {

        patch(route(getRouteName(selected), selected?.id), {
            onSuccess: () => {
                closeModal();
                const successMessage = getSuccessMessage
                    ? getSuccessMessage(selected)
                    : 'Archived successfully!';
                toast.success(successMessage);
            },
            onError: (errors) => {
                console.error('Archive error:', errors);
                const errorMessage = getErrorMessage
                    ? getErrorMessage(selected)
                    : 'Failed to archive. Please try again.';
                toast.error(errorMessage);
            }
        });
    };

    const title = selected?.name
        ? `Are you sure you want to ${action} "${selected.name}"?`
        : `Are you sure you want to ${action}?`;

    const description = getDescription ? getDescription(selected?.archived ?? false) : '';

    return (
        <Modal visible={isArchiveModalOpen} onClose={closeModal} variant="center">
            <>
                <div className="flex flex-col">
                    <div className="border-b p-5 pr-15">
                        <h2 className="text-3xl" aria-describedby="archive-description">
                            {title}
                        </h2>
                    </div>
                </div>
                <div className="p-5">
                    <p id="archive-description">{description}</p>
                </div>
                <div className="flex justify-end gap-x-5 p-5">
                    <Button type="button" variant="ghost" size="lg" onClick={closeModal}>
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        size="lg"
                        onClick={handleArchive}
                        disabled={processing} className={cn(processing ? 'opacity-50 cursor-not-allowed' : '')}
                        ref={submitRef}
                    >
                        {processing ? 'Archiving' : 'Confirm'}
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                    </Button>
                </div>
            </>
        </Modal>
    )
}