import { cn } from "@/lib/utils";
import { MenuIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { categories } from "@/utils/prodcuts";

export default function StoreSidebar() {
    const [selected, setSelected] = useState(1.9999);

    return (
        <aside className="border-r p-4 h-full">
            <img
                src={"https://digicatalog.top/storage/uploads/logo/logo-dark.png?timestamp=1729508148"}
                alt="logo"
                className="h-10 object-contain"
            />

            <div className="mt-8 space-y-2">
                {categories?.map((cat) =>
                    <Button key={cat.ctg_id} variant={selected === cat.ctg_id ? "default" : "ghost"} className="w-full justify-start">
                        {cat.ctg_name}
                    </Button>
                )}
            </div>
        </aside>
    )
}

export function StoreSidebarMobile() {
    const { pathname } = useLocation();
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
    }, [pathname])

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