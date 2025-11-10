import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function ListRow({ className, children }: { className?: string, children: ReactNode }) {
    return (
        <div className={cn('grid py-3 border-b border-list-border last:border-none relative group pr-16 hover:bg-list-row gap-5 lg:pr-32', className)}>
            {children}
        </ div>
    );
}