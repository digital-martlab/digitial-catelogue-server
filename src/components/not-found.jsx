import img from "@/assets/no-data.png";
import { cn } from "@/lib/utils";

export default function NotFound({ className }) {
    return (
        <div
            className={cn(
                "w-full h-full flex flex-col justify-center items-center text-center opacity-20",
                className,
            )}
        >
            <img
                src={img}
                alt="Not Found"
                className="mx-auto"
            />
        </div>
    );
}