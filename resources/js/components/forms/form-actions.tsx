import { LoaderCircle } from 'lucide-react';
import { Button } from '../ui/button';

type FormActionsProps = {
    onClose: () => void,
    processing?: boolean,
    cancelLabel?: string,
    saveLabel?: string
}

export default function FormActions({
    onClose,
    processing = false,
    cancelLabel = 'Cancel',
    saveLabel = 'Save'
}: FormActionsProps) {
    return (
        <div className="flex justify-end gap-x-5 border-t border-border dark:border-gray-500 p-5">
            <Button type="button" variant="ghost" size="lg" tabIndex={3} onClick={onClose}>
                {cancelLabel}
            </Button>
            <Button type="submit" size="lg" disabled={processing}>
                {processing ? (
                    <>
                        <LoaderCircle className="h-4 w-4 animate-spin mr-2" aria-hidden="true" />
                        <span>{saveLabel}...</span>
                    </>
                ) : (
                    saveLabel
                )}
            </Button>
        </div>

    );
}