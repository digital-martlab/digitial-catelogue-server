import { Skeleton } from "@/components/ui/skeleton";


export default function ShimmerAdminDashboard() {
    return (
        <>
            <div className="grid grid-cols-5 gap-6 mt-6">
                {Array.from({ length: 5 }, (_, index) => (
                    <Skeleton className="h-28 w-full" key={index} />
                ))}
            </div>
            {/* <Skeleton className="h-10 w-48 mt-8 mb-4" />
            <div className="grid grid-cols-5 gap-6">
                {Array.from({ length: 5 }, (_, index) => (
                    <Skeleton className="h-48 w-full" key={index} />
                ))}
            </div>
            <Skeleton className="h-10 w-48 mt-8 mb-4" />
            <div className="grid grid-cols-5 gap-6">
                {Array.from({ length: 5 }, (_, index) => (
                    <Skeleton className="h-48 w-full" key={index} />
                ))}
            </div> */}
            {/* <div className="grid grid-cols-2 mt-8 gap-6">
                <div>
                    <Skeleton className="h-10 w-48 mt-8 mb-4" />
                    <div className="grid grid-cols-1 gap-6">
                        {Array.from({ length: 5 }, (_, index) => (
                            <Skeleton className="h-28 w-full" key={index} />
                        ))}
                    </div>
                </div>
                <div>
                    <Skeleton className="h-10 w-48 mt-8 mb-4" />
                    <div className="grid grid-cols-1 gap-6">
                        {Array.from({ length: 5 }, (_, index) => (
                            <Skeleton className="h-28 w-full" key={index} />
                        ))}
                    </div>
                </div>
            </div> */}
        </>
    );
}