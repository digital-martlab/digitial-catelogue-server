import { Skeleton } from "@/components/ui/skeleton";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";

export default function ShimmerTableBody({ row, coloumn }) {
    return (
        <TableBody>
            {Array.from({ length: row }, (_, index) => (
                <TableRow key={index}>
                    {Array.from({ length: coloumn }, (_, index) => (
                        <TableCell className="py-2" key={index}>
                            <Skeleton className="w-20 h-4 mx-auto" />
                        </TableCell>
                    ))}
                </TableRow>
            ))}
        </TableBody>
    );
}