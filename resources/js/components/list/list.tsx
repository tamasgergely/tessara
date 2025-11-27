import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function List({ className, children }: { className?: string, children: ReactNode }) {
    return (
        <div className={cn('mt-5 text-sm bg-list p-2 rounded-lg md:px-5 lg:mx-0', className)}>
            {children}
        </div>
    );
}