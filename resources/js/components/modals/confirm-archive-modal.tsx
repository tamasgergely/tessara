import { useForm } from '@inertiajs/react'
import Modal from '@/components/modal';
import { Button } from "@/components/ui/button";
import { LoaderCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useClientModalStore } from '@/stores/modal-stores';

type ConfirmArchiveModalProps = {
    model: string,
    getDescription?: (isArchived: boolean) => string;
}

export default function ConfirmArchiveModal({ model, getDescription }: ConfirmArchiveModalProps) {

    const isArchiveModalOpen = useClientModalStore(state => state.isArchiveModalOpen);
    const selected = useClientModalStore(state => state.selected);
    const closeModal = useClientModalStore(state => state.closeModal);

    const { patch, processing } = useForm();
    const submitRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (submitRef.current) {
            submitRef.current.focus();
        }
    }, [isArchiveModalOpen]);

    if (!selected) return null;

    const action = selected.archived ? 'restore' : 'archive';

    const handleArchive = () => {
        patch(route(`${model}s.toggle-archive`, selected.id), {
            onSuccess: () => {
                closeModal();
                toast.success(`${model.charAt(0).toUpperCase()}${model.slice(1)} ${action}d successfully!`);
            },
            onError: (errors) => {
                console.error('Archive error:', errors);
                toast.error(`Failed to ${action} ${model}. Please try again.`);
            }
        });
    };

    const title = selected.name
        ? `Are you sure you want to ${action} "${selected.name}"?`
        : `Are you sure you want to ${action}?`;

    const description = getDescription ? getDescription(selected.archived) : '';

    return (
        <Modal visible={isArchiveModalOpen} onClose={closeModal} variant="center">
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
        </Modal>
    )
}