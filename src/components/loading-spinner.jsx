import { cn } from "@/lib/utils";

export default function LoadingSpinner({ className }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("animate-spin text-primary w-10 h-10", className)}
        >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
    );
}

export function WindowLoading() {
    return (
        <div className="h-screen w-full grid place-content-center">
            <LoadingSpinner className={"w-16 h-16"} />
        </div>
    )
}