import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import React from 'react';
import { useEffect } from 'react';
import { cva } from "class-variance-authority"

export default function Modal({
    visible,
    onClose,
    variant = 'side',
    children
}: {
    visible: boolean,
    onClose: () => void,
    variant?: "side" | "center"
    children: React.ReactNode
}) {

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        }

        if (visible) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        }
    }, [visible, onClose]);

    const modalClasses = cva(
        'bg-modal max-w-xl shadow-lg transform transition-all duration-300 pointer-default',
        {
            variants: {
                variant: {
                    side: 'absolute right-0 top-0 bottom-0 w-md',
                    center: '',
                    default: '',
                },
                visible: {
                    true: 'opacity-100',
                    false: 'opacity-0',
                },
            },
            compoundVariants: [
                {
                    variant: 'center',
                    visible: true,
                    class: 'scale-100',
                },
                {
                    variant: 'center',
                    visible: false,
                    class: 'scale-0',
                },
            ],
            defaultVariants: {
                variant: 'default',
                visible: false,
            },
        }
    );

    return (

        <div
            className={cn(
                'fixed inset-0 z-50 bg-black/50 transition-opacity duration-50',
                variant === 'center' ? 'grid place-items-center' : '',
                visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            )}
            onClick={onClose}
            aria-hidden={!visible}
        >
            <div className={cn(modalClasses({ variant, visible }))} onClick={(e) => e.stopPropagation()}>
                <span className="absolute p-2 right-3 top-3 hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer z-50 hover:rounded-full"
                    onClick={onClose}
                >
                    <X strokeWidth={1} size={32} />
                </span>

                {children}
            </div>
        </div >

    );
}