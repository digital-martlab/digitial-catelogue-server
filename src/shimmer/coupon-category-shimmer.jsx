import { Skeleton } from "@/components/ui/skeleton";

export default function CategoryCouponShimmer() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 4 }, (_, index) => (
                <Skeleton key={index} className="h-20" />
            ))}
        </div>
    )
}