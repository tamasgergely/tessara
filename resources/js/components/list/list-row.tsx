import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function ListRow({ className, children }: { className?: string, children: ReactNode }) {
    return (
        <div className={cn('grid py-3 border-b border-list-border last:border-none relative group hover:bg-list-row pr-16 gap-2 md:gap-x-5 2xl:gap-x-10 lg:pr-32', className)}>
            {children}
        </ div>
    );
}