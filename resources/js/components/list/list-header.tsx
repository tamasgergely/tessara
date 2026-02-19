import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function ListHeader({ className, children }: { className?: string, children: ReactNode }) {
    return (
        <div className={cn("hidden py-3 font-bold border-b border-list-border pr-12 gap-x-2 sm:grid md:gap-x-5 2xl:gap-x-10", className)}>
            {children}
        </div>
    )
}