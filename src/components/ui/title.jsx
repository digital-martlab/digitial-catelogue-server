import { cn } from "@/lib/utils";

export default function Title({ title, className }) {
    return (
        <h2 className={cn("text-2xl font-semibold text-primary", className)}>
            {title}
        </h2>
    );
}

