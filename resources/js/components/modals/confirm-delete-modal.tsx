import { useForm } from '@inertiajs/react'
import Modal from '@/components/modal';
import { Button } from "@/components/ui/button";
import { LoaderCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

export default function ConfirmDeleteModal({ visible, onClose, id, name, description, model }: { visible: boolean, onClose: () => void, id?: number, name?: string, description: string, model: string }) {

    const { delete: destroy, processing } = useForm();

    const submitRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (submitRef.current) {
            submitRef.current.focus();
        }
    }, [visible]);

    const onDelete = () => {
        if (!id) return;
        destroy(route(`${model}s.destroy`, id), {
            onSuccess: () => {
                onClose();
                toast.success(`${model.charAt(0).toUpperCase()}${model.slice(1)} deleted successfully!`);
            },
            onError: (errors) => {
                console.error('Delete error:', errors);
                toast.error(`Failed to delete ${model}. Please try again.`);
            }
        });
    };

    return (
        <Modal visible={visible} onClose={onClose} variant="center">
            <>
                <div className="flex flex-col">
                    <div className="border-b p-5 pr-15">
                        <h2 className="text-3xl" aria-describedby="delete-description">
                            {name ? `Are you sure you want to delete "${name}"?` : 'Are you sure you want to delete?' }
                        </h2>
                    </div>
                </div>
                <div className="p-5">
                    <p id="delete-description">{description}</p>
                </div>
                <div className="flex justify-end gap-x-5 p-5">
                    <Button type="button" variant="ghost" size="lg" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        size="lg"
                        onClick={() => onDelete()}
                        disabled={!id || processing} className={cn(processing ? 'opacity-50 cursor-not-allowed' : '')}
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