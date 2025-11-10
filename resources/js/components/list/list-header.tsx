import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function ListHeader({ className, children }: { className?: string, children: ReactNode }) {
    return (
        <div className={cn("hidden sm:grid py-3 font-bold border-b border-list-border pr-16 lg:pr-32 gap-x-2 md:gap-x-5", className)}>
            {children}
        </div>
    )
}