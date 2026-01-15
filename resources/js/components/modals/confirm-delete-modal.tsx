import type { DeletableEntity } from '@/types';
import { useForm } from '@inertiajs/react'
import Modal from '@/components/modal';
import { Button } from "@/components/ui/button";
import { LoaderCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

type ConfirmDeleteModalProps = {
    useStore: any,
    description: string,
    getRouteName: (entity: DeletableEntity) => string,
    getSuccessMessage?: (entity: DeletableEntity) => string,
    getErrorMessage?: (entity: DeletableEntity) => string
}

export default function ConfirmDeleteModal({ useStore, description, getRouteName, getSuccessMessage, getErrorMessage }: ConfirmDeleteModalProps) {

    const isDeleteModalOpen = useStore(state => state.isDeleteModalOpen);
    const selected = useStore(state => state.selected);
    const closeModal = useStore(state => state.closeModal);

    const { delete: destroy, processing } = useForm();

    const submitRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (submitRef.current) {
            submitRef.current.focus();
        }
    }, [isDeleteModalOpen]);

    const handleDelete = () => {
        if (!selected?.id) return;

        destroy(route(getRouteName(selected), selected.id), {
            onSuccess: () => {
                closeModal();
                const successMessage = getSuccessMessage
                    ? getSuccessMessage(selected)
                    : 'Deleted successfully!';
                toast.success(successMessage);
            },
            onError: (errors) => {
                console.error('Delete error:', errors);
                const errorMessage = getErrorMessage
                    ? getErrorMessage(selected)
                    : 'Failed to delete. Please try again.';
                toast.error(errorMessage);
            }
        });
    };

    return (
        <Modal visible={isDeleteModalOpen} onClose={closeModal} variant="center">
            <>
                <div className="flex flex-col">
                    <div className="border-b p-5 pr-15">
                        <h2 className="text-3xl" aria-describedby="delete-description">
                            Are you sure you want to delete <strong>{selected?.name}</strong>?
                        </h2>
                    </div>
                </div>
                <div className="p-5">
                    <p id="delete-description">{description}</p>
                </div>
                <div className="flex justify-end gap-x-5 p-5">
                    <Button type="button" variant="ghost" size="lg" onClick={closeModal}>
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        size="lg"
                        onClick={() => handleDelete()}
                        disabled={!selected?.id || processing} className={cn(processing ? 'opacity-50 cursor-not-allowed' : '')}
                        ref={submitRef}
                    >
                        {processing ? 'Deleting' : 'Confirm'}
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                    </Button>
                </div>
            </>
        </Modal>
    )
}