import toast from 'react-hot-toast';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function sessionExpiredToast() {
    toast.error(
        (t) => (
            <div className="flex items-center gap-3">
                <span>Your session has expired.</span>

                <Button
                    size="sm"
                    onClick={() => {
                        toast.dismiss(t.id);
                        // Full page load rather than an Inertia visit: the visit
                        // would carry the same dead session and fail the same way.
                        window.location.href = '/';
                    }}>
                    Log in
                </Button>

                <button
                    type="button"
                    aria-label="Dismiss"
                    className="cursor-pointer text-muted-foreground hover:text-foreground"
                    onClick={() => toast.dismiss(t.id)}>
                    <X size={14} />
                </button>
            </div>
        ),
        // Stays until acted on, and one shared id keeps concurrent failures
        // from stacking several copies of the same message.
        { duration: Infinity, id: 'session-expired' },
    );
}
