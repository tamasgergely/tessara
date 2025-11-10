import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function List({ className, children }: { className?: string, children: ReactNode }) {
    return (
        <div className={cn('mt-5 text-sm bg-list py-2 px-2 md:px-5 rounded-lg', className)}>
            {children}
        </div>
    );
}