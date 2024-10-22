import { AdminSidbarList, SuperAdminSidbarList } from "@/lib/sidebar-list";
import { cn } from "@/lib/utils";
import { MenuIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { buttonVariants } from "../ui/button";
import useAuth from "@/hooks/use-auth";
import { ROLES } from "@/lib/roles";


export default function AdminSidebar() {
    const { auth } = useAuth();
    const { pathname } = useLocation();


    return (
        <aside className="border-r p-4 h-full">
            <img
                src={
                    auth?.role === ROLES.SUPER_ADMIN
                        ? "https://digicatalog.top/storage/uploads/logo/logo-dark.png?timestamp=1729508148"
                        : auth?.logo
                }
                alt="logo"
                className="h-10 object-contain"
            />

            <div className="mt-8 space-y-2">
                {
                    [...(auth?.role === ROLES.SUPER_ADMIN ? SuperAdminSidbarList : AdminSidbarList)].map((item) => (
                        <Link to={item.link} key={item?._id} className={cn(buttonVariants({
                            size: "sm",
                            variant: pathname === item.link ? "default" : "ghost"
                        }), "w-full justify-start")}>
                            <item.icon />
                            {item.title}
                        </Link>
                    ))
                }
            </div>
        </aside>
    )
}

export function AdminSidebarMobile() {
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


    return (
        <div className="lg:hidden">
            <MenuIcon fontSize="large" onClick={handleToggle} />
            <div className={cn("fixed z-50 w-full h-screen top-0 left-0 bg-black", open ? "block bg-opacity-50" : "hidden bg-opacity-0")}>
                <div
                    ref={sidebarRef}
                    className={cn("fixed w-[200px] h-screen bg-background transition-left duration-300", open ? "left-0" : "-left-1/2")}
                >
                    <AdminSidebar />
                </div>
            </div>
        </div>
    );
}