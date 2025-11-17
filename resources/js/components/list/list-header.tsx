import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function ListHeader({ className, children }: { className?: string, children: ReactNode }) {
    return (
        <div className={cn("hidden py-3 font-bold border-b border-list-border pr-16 gap-x-2 sm:grid md:gap-x-5 lg:pr-32 2xl:gap-x-10", className)}>
            {children}
        </div>
    )
}