import useStore from "@/hooks/use-store";
import { cn } from "@/lib/utils";
import { MenuIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { LazyLoadComponent } from "react-lazy-load-image-component";

export default function StoreSidebar() {
    const { storeInfo, categories, setSelectedCategories, selectedCategories } = useStore();

    const handleSelected = (value) => setSelectedCategories(value)

    return (
        <aside className="border-r p-4 h-full">
            <LazyLoadComponent
                src={storeInfo?.logo}
                alt="logo"
                className="h-10 object-contain mx-auto"
            />

            <div className="mt-8 space-y-2">
                <Button
                    key={1.9999}
                    variant={selectedCategories === 1.9999 ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => handleSelected(1.9999)}
                >
                    All
                </Button>
                {categories?.map((cat) =>
                    <Button
                        key={cat.ctg_id}
                        variant={selectedCategories === cat.ctg_id ? "default" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => handleSelected(cat?.ctg_id)}
                    >
                        {cat.ctg_name}
                    </Button>
                )}
            </div>
        </aside >
    )
}

export function StoreSidebarMobile() {
    const { selectedCategories } = useStore();
    const [open, setOpen] = useState(false);
    const sidebarRef = useRef(null);

    const handleToggle = () => setOpen(prev => !prev);

    const handleClickOutside = (event) => {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
            setOpen(false);
        }
    };

    useEffect(() => {
        if (open) document.addEventListener("mousedown", handleClickOutside);
        else document.removeEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open]);

    useEffect(() => {
        setOpen(false);
    }, [selectedCategories])

    return (
        <div className="lg:hidden">
            <MenuIcon fontSize="large" onClick={handleToggle} />
            <div className={cn("fixed z-50 w-full h-screen top-0 left-0 bg-black", open ? "block bg-opacity-50" : "hidden bg-opacity-0")}>
                <div
                    ref={sidebarRef}
                    className={cn("fixed w-[200px] h-screen bg-background transition-left duration-300", open ? "left-0" : "-left-1/2")}
                >
                    <StoreSidebar />
                </div>
            </div>
        </div>
    );
}